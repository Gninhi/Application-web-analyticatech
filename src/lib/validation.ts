import { z } from "zod";

/**
 * Schéma de validation du formulaire de contact (Zod).
 * Utilisé côté client (avant envoi) ET côté serveur (endpoint API).
 */

// Domaines email jetables / gratuits bloqués — on exige un email "professionnel".
const BLOCKED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "mail.ru",
  "yandex.com",
  "proton.me",
  "protonmail.com",
];

export const contactSchema = z.object({
  // Honeypot anti-spam — doit rester vide côté client légitime.
  // Simplifié (audit : max(0) autorise déjà "" et est plus simple que .or(z.literal("")))
  companyUrl: z.string().max(0, "Champ honeypot invalide").optional(),

  prenom: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(60, "Le prénom est trop long"),

  nom: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(60, "Le nom est trop long"),

  email: z
    .email("Format d'email invalide")
    .refine((value) => {
      const domain = value.split("@")[1]?.toLowerCase();
      return domain ? !BLOCKED_DOMAINS.includes(domain) : false;
    }, "Veuillez utiliser un email professionnel (entreprise)"),

  entreprise: z
    .string()
    .trim()
    .min(2, "L'entreprise doit contenir au moins 2 caractères")
    .max(120, "Le nom de l'entreprise est trop long"),

  sujet: z
    .string()
    .trim()
    .min(3, "Le sujet doit contenir au moins 3 caractères")
    .max(150, "Le sujet est trop long"),

  message: z
    .string()
    .trim()
    .min(20, "Le message doit contenir au moins 20 caractères")
    .max(2000, "Le message est trop long (2000 caractères max)"),

  // Consentement RGPD — doit être explicitement accepté
  consent: z
    .boolean()
    .refine((v) => v === true, {
      message: "Vous devez accepter la politique de confidentialité",
    }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/** Réponse normalisée de l'API contact. */
export interface ContactApiResponse {
  success: boolean;
  message: string;
  reference?: string;
  errors?: Array<{ field: string; message: string }>;
}
