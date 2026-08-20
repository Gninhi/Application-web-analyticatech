import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, type ContactApiResponse } from "@/lib/validation/schemas";
import { getServerEnv } from "@/lib/env";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { sanitizeObject } from "@/lib/security/sanitize";
import { audit, hashIp } from "@/lib/observability/audit";
import { getRequestFingerprint } from "@/lib/security/fingerprint";
import { isSuspiciousUserAgent, readBodyWithLimit } from "@/lib/security/user-agent";
import { validateCsrfToken } from "@/lib/security/csrf";
import { isOriginAllowed } from "@/lib/security/origin";
import { MAX_BODY_SIZE } from "@/lib/content/site";
import { db } from "@/lib/db/client";
import { sendContactNotification } from "@/lib/email/mailer";

/**
 * POST /api/v1/contact — endpoint sécurisé en défense en profondeur.
 *
 * Couches réellement appliquées :
 *  1. CSRF double-submit (vérifié à nouveau ici, pas seulement dans le middleware)
 *  2. Vérification d'origine (allowlist via ALLOWED_ORIGINS)
 *  3. Bot detection (UA suspect → 403)
 *  4. Rate limiting par fingerprint (IP + UA + lang hashé) — 5 req/h
 *  5. Anti-DoS : taille max du payload (content-length > 16 KB → 413)
 *  6. Multi-honeypot (companyUrl + website + fax — tous doivent être vides)
 *  7. Validation Zod stricte (email pro, longueurs, format)
 *  8. Sanitization XSS (récursif sur strings + arrays d'objets)
 *  9. Délai anti-timing (500ms) — prévient les attaques par timing
 * 10. Persistance en base (ContactRequest) avec IP/fingerprint hashés (RGPD)
 * 11. Notification email (transport réel si RESEND_API_KEY, sinon stub logué)
 * 12. Audit logging persisté (sans PII)
 * 13. Réponses normalisées sans fuite d'info interne + headers stricts
 */

const CSRF_COOKIE = "at-csrf";
const CSRF_HEADER = "x-csrf-token";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Content-Security-Policy":
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

function json(body: ContactApiResponse, status: number, extra?: Record<string, string>) {
  return NextResponse.json(body, {
    status,
    headers: { ...SECURITY_HEADERS, ...(extra ?? {}) },
  });
}

const HONEYPOT_FIELDS = ["companyUrl", "website", "fax", "phone2"] as const;

/** Build l'allowlist d'origines depuis l'env. Fallback fail-closed sur NEXT_PUBLIC_SITE_URL. */
function getAllowedOrigins(): string[] {
  const env = getServerEnv();
  const raw = env.ALLOWED_ORIGINS ?? env.NEXT_PUBLIC_SITE_URL ?? "";
  const configured = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  // Hors production : autorise explicitement localhost pour les tests locaux
  // (dev, Playwright, tests manuels). En production, seule l'env fait foi
  // (fail-closed). La protection reste assurée par le CSRF double-submit.
  if (process.env.NODE_ENV !== "production") {
    return [
      ...configured,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ];
  }
  return configured;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const fingerprint = getRequestFingerprint(req);
  const ua = req.headers.get("user-agent");

  // 1. CSRF réellement re-validé ici (double-submit pattern, defense in depth).
  const cookieToken = req.cookies.get(CSRF_COOKIE)?.value ?? null;
  const headerToken = req.headers.get(CSRF_HEADER);
  if (!validateCsrfToken(cookieToken, headerToken)) {
    audit.warn("Contact: CSRF token mismatch", {
      ipHash,
      fingerprint,
      hasCookie: Boolean(cookieToken),
      hasHeader: Boolean(headerToken),
    });
    return json(
      { success: false, message: "Token de sécurité invalide. Veuillez rafraîchir la page." },
      403
    );
  }

  // 2. Vérification d'origine (anti-CSRF layer supplémentaire).
  //    Fail-closed : si aucune origine n'est configurée, la requête est rejetée.
  const allowed = getAllowedOrigins();
  if (allowed.length === 0) {
    audit.warn("Contact: no allowed origins configured, rejecting", { ipHash, fingerprint });
    return json({ success: false, message: "Origine non autorisée." }, 403);
  }
  if (!isOriginAllowed(req, allowed)) {
    audit.warn("Contact: origin not allowed", { ipHash, fingerprint });
    return json({ success: false, message: "Origine non autorisée." }, 403);
  }

  // 3. Bot detection.
  if (await isSuspiciousUserAgent(ua)) {
    audit.alert("Contact: blocked suspicious UA", {
      ipHash,
      fingerprint,
      userAgent: ua?.slice(0, 80),
    });
    return json({ success: false, message: "Requête non autorisée." }, 403);
  }

  // 4. Rate limiting.
  const rl = checkRateLimit(`contact:${fingerprint}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rl.allowed) {
    const retryAfterSec = Math.ceil((rl.resetAt - Date.now()) / 1000);
    audit.warn("Contact: rate limit exceeded", {
      ipHash,
      fingerprint,
      remaining: rl.remaining,
    });
    return json(
      {
        success: false,
        message:
          "Trop de tentatives. Cet endpoint est limité à 5 requêtes par heure. Réessayez plus tard.",
      },
      429,
      { "Retry-After": String(retryAfterSec) }
    );
  }

  // 5. Anti-DoS (taille du payload) + Parsing JSON.
  //    Lecture en stream avec plafond : bloque aussi les corps chunked
  //    sans content-length qui contournaient le check statique.
  const rawText = await readBodyWithLimit(req, MAX_BODY_SIZE);
  if (rawText === null) {
    audit.warn("Contact: payload too large", { ipHash, fingerprint });
    return json({ success: false, message: "Payload trop volumineux." }, 413);
  }
  let raw: unknown;
  try {
    raw = JSON.parse(rawText);
  } catch {
    audit.warn("Contact: invalid JSON payload", { ipHash, fingerprint });
    return json({ success: false, message: "Payload JSON invalide." }, 400);
  }

  // 6. Multi-honeypot — un seul champ rempli => bot.
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const triggeredHoneypot = HONEYPOT_FIELDS.find(
      (field) => typeof obj[field] === "string" && obj[field] !== ""
    );
    if (triggeredHoneypot) {
      await new Promise((r) => setTimeout(r, 500));
      audit.warn("Contact: honeypot triggered", {
        ipHash,
        fingerprint,
        field: triggeredHoneypot,
      });
      return json(
        {
          success: true,
          message: "Demande reçue. Un architecte vous répondra sous 24h.",
          reference: "AT-" + Date.now().toString(36).toUpperCase(),
        },
        200
      );
    }
  }

  // 7. Validation Zod.
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: String(issue.path[0] ?? "form"),
      message: issue.message,
    }));
    await new Promise((r) => setTimeout(r, 400));
    audit.info("Contact: validation failed", {
      ipHash,
      fingerprint,
      errorCount: errors.length,
    });
    return json(
      {
        success: false,
        message: "Validation échouée. Vérifiez les champs renseignés.",
        errors,
      },
      422
    );
  }

  // 7b. Vérification dynamique du domaine email en base de données (BlockedEmailDomain)
  const emailDomain = parsed.data.email.split("@")[1]?.toLowerCase();
  if (emailDomain) {
    try {
      const isBlocked = await db.blockedEmailDomain.findUnique({
        where: { domain: emailDomain },
      });
      if (isBlocked) {
        return json(
          {
            success: false,
            message: "Veuillez utiliser un email professionnel (entreprise).",
            errors: [{ field: "email", message: "Domaine de messagerie non autorisé" }],
          },
          422
        );
      }
    } catch {
      // Poursuite si la vérification BDD échoue
    }
  }

  // 8. Sanitization XSS.
  const sanitized = sanitizeObject({
    prenom: parsed.data.prenom,
    nom: parsed.data.nom,
    email: parsed.data.email,
    entreprise: parsed.data.entreprise,
    sujet: parsed.data.sujet,
    message: parsed.data.message,
  });

  // 9. Délai anti-timing.
  await new Promise((r) => setTimeout(r, 500));

  // 10. Référence traçable.
  const reference = `AT-${new Date().getFullYear()}-${Date.now()
    .toString(36)
    .toUpperCase()
    .slice(-6)}`;

  // 11. Persistance en base (IP/fingerprint hashés — RGPD).
  try {
    await db.contactRequest.create({
      data: {
        reference,
        prenom: sanitized.prenom,
        nom: sanitized.nom,
        email: sanitized.email,
        entreprise: sanitized.entreprise,
        sujet: sanitized.sujet,
        message: sanitized.message,
        ipHash,
        fingerprint,
        status: "new",
        consent: parsed.data.consent,
      },
    });
  } catch (err) {
    audit.warn("Contact: échec persistance DB", {
      reference,
      error: err instanceof Error ? err.message : String(err),
    });
    return json(
      { success: false, message: "Erreur serveur. Réessayez ultérieurement." },
      500
    );
  }

  // 12. Notification email (non bloquant — fire-and-forget avec audit log).
  void sendContactNotification({
    reference,
    prenom: sanitized.prenom,
    nom: sanitized.nom,
    email: sanitized.email,
    entreprise: sanitized.entreprise,
    sujet: sanitized.sujet,
    message: sanitized.message,
  });

  audit.info("Contact: nouvelle demande persistée", {
    reference,
    entreprise: sanitized.entreprise,
    sujet_len: sanitized.sujet.length,
  });

  return json(
    {
      success: true,
      message:
        "Transmission sécurisée confirmée. Un architecte Analyticatech vous répondra sous 24h ouvrées.",
      reference,
    },
    201
  );
}

export async function GET() {
  return json(
    { success: false, message: "Méthode non autorisée. Utilisez POST." },
    405,
    { Allow: "POST" }
  );
}
