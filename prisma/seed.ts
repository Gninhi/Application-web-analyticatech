/* eslint-disable no-console */
import { db } from "@/lib/db/client";

async function seed() {
  console.log("🌱 Seed des listes de sécurité...");

  // Le contenu éditorial (services, solutions, articles, mentions légales…)
  // est versionné dans le code (`src/lib/content/`) et n'est plus lu en base :
  // ce seed n'insère que les listes de sécurité utilisées par l'API de contact.
  // Les anciennes tables de contenu ne sont plus alimentées.

  // ============================================================
  // BLOCKED EMAIL DOMAINS & SUSPICIOUS UA PATTERNS (Sécurité)
  // ============================================================
  const blockedDomains = [
    "guerrillamail.com",
    "tempmail.org",
    "10minutemail.com",
    "dispostable.com",
    "throwawaymail.com",
    "mailinator.com",
    "yopmail.com",
    "trashmail.com",
  ];

  for (const domain of blockedDomains) {
    await db.blockedEmailDomain.upsert({
      where: { domain },
      update: { active: true },
      create: { domain, reason: "Disposable email domain", active: true },
    });
  }

  const suspiciousPatterns = [
    { pattern: "sqlmap", category: "scanner" as const },
    { pattern: "nikto", category: "scanner" as const },
    { pattern: "nmap", category: "scanner" as const },
    { pattern: "gobuster", category: "scanner" as const },
    { pattern: "dirbuster", category: "scanner" as const },
    { pattern: "masscan", category: "scanner" as const },
    { pattern: "zgrab", category: "scanner" as const },
    { pattern: "python-requests", category: "bot" as const },
  ];

  for (const p of suspiciousPatterns) {
    await db.suspiciousUAPattern.upsert({
      where: { pattern: p.pattern },
      update: { category: p.category, active: true },
      create: { pattern: p.pattern, category: p.category, active: true },
    });
  }
  console.log("✓ Domaines bloqués & patterns de sécurité insérés");

  console.log("✅ Seed terminé.");
}

seed()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
