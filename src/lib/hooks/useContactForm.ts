"use client";

import { useState } from "react";
import { contactSchema, type ContactApiResponse } from "@/lib/validation/schemas";
import { safeFetch, FetchError } from "@/lib/http/safe-fetch";
import { useI18n } from "@/lib/i18n/provider";
import { getTelemetryDistinctId, trackContactFormSubmitted } from "@/instrumentation-client";

export interface ContactFormState {
  prenom: string;
  nom: string;
  email: string;
  entreprise: string;
  sujet: string;
  message: string;
  consent: boolean;
  companyUrl: string; // honeypot 1
  website: string;    // honeypot 2
  fax: string;        // honeypot 3
}

export const EMPTY_CONTACT_FORM: ContactFormState = {
  prenom: "",
  nom: "",
  email: "",
  entreprise: "",
  sujet: "",
  message: "",
  consent: false,
  companyUrl: "",
  website: "",
  fax: "",
};

export type FormStatus = "idle" | "submitting" | "success" | "error";

/** Ordre naturel des champs dans le formulaire pour le focus du 1er champ invalide. */
const FIELD_ORDER: (keyof ContactFormState)[] = [
  "prenom",
  "nom",
  "email",
  "entreprise",
  "sujet",
  "message",
  "consent",
];

/** A11y : déplace le focus vers le 1er champ invalide. */
function focusFirstInvalid(errors: Partial<Record<keyof ContactFormState, string>>) {
  const first = FIELD_ORDER.find((f) => errors[f]);
  if (first) {
    document.getElementById(first)?.focus();
  }
}

export function useContactForm() {
  const { t } = useI18n();
  const [form, setForm] = useState<ContactFormState>(EMPTY_CONTACT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [reference, setReference] = useState("");

  const update = (field: keyof ContactFormState, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) {
      setErrors((p) => ({ ...p, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation Zod côté client
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormState, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormState;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatus("error");
      setServerMsg(t("contact.err.validation"));
      focusFirstInvalid(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    setServerMsg("");

    try {
      // Lecture du token CSRF depuis le cookie posé par le proxy
      const csrfToken =
        document.cookie
          .split("; ")
          .find((c) => c.startsWith("at-csrf="))
          ?.split("=")[1] ?? "";

      const posthogId = getTelemetryDistinctId();
      const res = await safeFetch<ContactApiResponse>("/api/v1/contact", {
        method: "POST",
        body: JSON.stringify(result.data),
        timeoutMs: 12000,
        retries: 1,
        headers: {
          "x-csrf-token": csrfToken,
          ...(posthogId ? { "x-posthog-id": posthogId } : {}),
        },
      });

      if (res.success) {
        setStatus("success");
        setServerMsg(res.message);
        setReference(res.reference ?? "");
        setForm(EMPTY_CONTACT_FORM);

        // Télémétrie PostHog : confirmation d'envoi sans aucune donnée personnelle
        trackContactFormSubmitted({
          subject_length: result.data.sujet.length,
          has_company: Boolean(result.data.entreprise),
          reference: res.reference,
        });
      } else {
        setStatus("error");
        setServerMsg(res.message);
        if (res.errors) {
          const fe: Partial<Record<keyof ContactFormState, string>> = {};
          for (const err of res.errors) {
            fe[err.field as keyof ContactFormState] = err.message;
          }
          setErrors(fe);
          focusFirstInvalid(fe);
        }
      }
    } catch (err) {
      setStatus("error");
      if (err instanceof FetchError && err.status === 429) {
        setServerMsg(t("contact.err.ratelimit"));
      } else {
        setServerMsg(t("contact.err.network"));
      }
    }
  };

  return {
    form,
    errors,
    status,
    serverMsg,
    reference,
    update,
    handleSubmit,
  };
}
