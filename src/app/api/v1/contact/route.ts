import { NextResponse } from "next/server";
import { contactSchema, type ContactApiResponse } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";

/**
 * POST /api/v1/contact
 *
 * Endpoint sécurisé "niveau bancaire" :
 *  - Rate limiting : 5 requêtes / heure / IP
 *  - Honeypot anti-spam (champ companyUrl doit rester vide)
 *  - Validation Zod stricte (email professionnel, longueurs)
 *  - Sanitization HTML (prévention XSS)
 *  - Délai artificiel anti-timing (500ms)
 *  - Réponses normalisées sans fuite d'information
 */

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Content-Security-Policy":
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

function json(body: ContactApiResponse, status: number, extra?: Record<string, string>) {
  return NextResponse.json(body, {
    status,
    headers: { ...SECURITY_HEADERS, ...(extra ?? {}) },
  });
}

export async function POST(req: Request) {
  // 1. Rate limiting — 5 requêtes / heure / IP
  const ip = getClientIp(req);
  const rl = checkRateLimit(`contact:${ip}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!rl.allowed) {
    const retryAfterSec = Math.ceil((rl.resetAt - Date.now()) / 1000);
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

  // 2. Parsing du corps
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json(
      { success: false, message: "Payload JSON invalide." },
      400
    );
  }

  // 3. Honeypot — si companyUrl est rempli => bot, on répond 200 faux succès
  if (
    raw &&
    typeof raw === "object" &&
    "companyUrl" in raw &&
    typeof (raw as Record<string, unknown>).companyUrl === "string" &&
    (raw as Record<string, unknown>).companyUrl !== ""
  ) {
    await new Promise((r) => setTimeout(r, 500));
    return json(
      {
        success: true,
        message: "Demande reçue. Un architecte vous répondra sous 24h.",
        reference: "HONEY-" + Date.now().toString(36).toUpperCase(),
      },
      200
    );
  }

  // 4. Validation Zod stricte
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: String(issue.path[0] ?? "form"),
      message: issue.message,
    }));
    await new Promise((r) => setTimeout(r, 400));
    return json(
      {
        success: false,
        message: "Validation échouée. Vérifiez les champs renseignés.",
        errors,
      },
      422
    );
  }

  // 5. Sanitization XSS
  const sanitized = sanitizeObject({
    prenom: parsed.data.prenom,
    nom: parsed.data.nom,
    email: parsed.data.email,
    entreprise: parsed.data.entreprise,
    sujet: parsed.data.sujet,
    message: parsed.data.message,
  });

  // 6. Délai artificiel anti-timing (500ms)
  await new Promise((r) => setTimeout(r, 500));

  // 7. Génération d'une référence traçable (en production : persistance + email)
  const reference = `AT-${new Date().getFullYear()}-${Date.now()
    .toString(36)
    .toUpperCase()
    .slice(-6)}`;

  console.info("[contact] Nouvelle demande", {
    reference,
    ip: ip.slice(0, 8) + "***",
    entreprise: sanitized.entreprise,
    sujet_len: sanitized.sujet.length,
    ts: new Date().toISOString(),
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
