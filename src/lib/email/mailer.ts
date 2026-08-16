/**
 * Mailer — transport des notifications email.
 *
 * ARCHITECTURE EXTENSIBLE :
 *  - Si `RESEND_API_KEY` est défini → envoi réel via Resend.
 *  - Sinon → mode "stub" : log structuré (utile en dev / preview serverless).
 *
 * POUR ACTIVER L'ENVOI RÉEL :
 *   1. Définir RESEND_API_KEY, MAIL_FROM, MAIL_TO dans .env / Vercel
 *   2. Vérifier le domaine d'envoi chez Resend (records DNS SPF + DKIM)
 *   3. Le code ci-dessous bascule automatiquement sur le transport réel.
 *
 * `resend` est une dépendance réelle (package.json) : import statique, bundle
 * sûr sous Turbopack et dans les fonctions serveurless Vercel.
 */

import { Resend } from "resend";
import { audit } from "@/lib/observability/audit";

export interface ContactMailPayload {
  reference: string;
  prenom: string;
  nom: string;
  email: string;
  entreprise: string;
  sujet: string;
  message: string;
}

export async function sendContactNotification(payload: ContactMailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? "Analyticatech <contact@analyticatech.fr>";
  const to = process.env.MAIL_TO ?? "leads@analyticatech.fr";

  if (!apiKey) {
    // Mode stub : log structuré pour monitoring / récupération par un cron.
    audit.info("Contact: notification email (stub mode)", {
      reference: payload.reference,
      to,
      sujet_len: payload.sujet.length,
    });
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const subject = `[${payload.reference}] Nouvelle demande — ${payload.entreprise}`;
    const textBody = renderContactText(payload);

    await resend.emails.send({
      from,
      to,
      subject,
      text: textBody,
      replyTo: payload.email,
    });

    audit.info("Contact: notification email envoyée", { reference: payload.reference });
  } catch (err) {
    audit.warn("Contact: échec envoi email (fallback stub)", {
      reference: payload.reference,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

/** Corps texte plat — utilisable aussi bien pour l'email que pour le log stub. */
function renderContactText(p: ContactMailPayload): string {
  return [
    `Référence : ${p.reference}`,
    "",
    `Nom      : ${p.prenom} ${p.nom}`,
    `Email    : ${p.email}`,
    `Société  : ${p.entreprise}`,
    "",
    `Sujet    : ${p.sujet}`,
    "",
    "Message :",
    p.message,
    "",
    `Repondre directement à ${p.email}.`,
  ].join("\n");
}
