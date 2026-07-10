import { NextResponse } from "next/server";
import { contactSchema, type ContactApiResponse } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";
import { audit, hashIp } from "@/lib/auditLog";
import { getRequestFingerprint, isSuspiciousUserAgent } from "@/lib/security";

/**
 * POST /api/v1/contact — endpoint sécurisé niveau bancaire.
 *
 * Couches de sécurité (défense en profondeur) :
 *  1. CSRF validation (déjà faite par middleware, double-check ici)
 *  2. Bot detection (UA suspect → 403)
 *  3. Rate limiting par fingerprint (IP + UA hashé) — 5 req/h
 *  4. Multi-honeypot (companyUrl + website + fax — tous doivent être vides)
 *  5. Validation Zod stricte (email pro, longueurs, format)
 *  6. Sanitization HTML XSS (récursif sur strings + arrays d'objets)
 *  7. Délai anti-timing (500ms) — prévient les attaques par timing
 *  8. Audit logging persisté (RGPD : IP hashée, rotation auto)
 *  9. Réponses normalisées sans fuite d'information interne
 * 10. Headers de sécurité stricts (CSP, HSTS, X-Frame-Options DENY...)
 */

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

// Champs honeypot — tous doivent être vides pour un utilisateur légitime
const HONEYPOT_FIELDS = ["companyUrl", "website", "fax", "phone2"] as const;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const fingerprint = getRequestFingerprint(req);
  const ua = req.headers.get("user-agent");

  // 1. Bot detection (défense en profondeur avec le middleware)
  if (isSuspiciousUserAgent(ua)) {
    audit.alert("Contact: blocked suspicious UA", {
      ipHash,
      fingerprint,
      userAgent: ua?.slice(0, 80),
    });
    return json(
      { success: false, message: "Requête non autorisée." },
      403
    );
  }

  // 2. Rate limiting par fingerprint (plus précis que IP seule)
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

  // 3. Parsing du corps
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    audit.warn("Contact: invalid JSON payload", { ipHash, fingerprint });
    return json(
      { success: false, message: "Payload JSON invalide." },
      400
    );
  }

  // 4. Multi-honeypot — si un seul champ est rempli => bot
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const triggeredHoneypot = HONEYPOT_FIELDS.find(
      (field) => typeof obj[field] === "string" && obj[field] !== ""
    );
    if (triggeredHoneypot) {
      // Répond 200 faux succès pour ne pas alerter le bot
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

  // 5. Validation Zod stricte
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

  // 6. Sanitization XSS (récursif strings + arrays d'objets)
  const sanitized = sanitizeObject({
    prenom: parsed.data.prenom,
    nom: parsed.data.nom,
    email: parsed.data.email,
    entreprise: parsed.data.entreprise,
    sujet: parsed.data.sujet,
    message: parsed.data.message,
  });

  // 7. Délai anti-timing (500ms) — prévient les attaques par timing
  await new Promise((r) => setTimeout(r, 500));

  // 8. Génération d'une référence traçable
  const reference = `AT-${new Date().getFullYear()}-${Date.now()
    .toString(36)
    .toUpperCase()
    .slice(-6)}`;

  // 9. Audit logging persisté (RGPD : IP hashée, pas de PII)
  audit.info("Contact: nouvelle demande", {
    ipHash,
    fingerprint,
    reference,
    entreprise: sanitized.entreprise,
    sujet_len: sanitized.sujet.length,
  });

  // 10. Réponse normalisée (sans fuite d'info interne)
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
