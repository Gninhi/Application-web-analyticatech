/**
 * Seed — initialise les métriques et logos clients en base.
 * À exécuter avec : bun run scripts/seed.ts
 */
import { db } from "@/lib/db";

async function seed() {
  console.log("🌱 Début du seed...");

  // === Métriques ===
  const metrics = [
    { key: "missions_delivered", label: "Missions livrées", value: "127+", numericValue: 127, suffix: "+", order: 1 },
    { key: "cost_reduction", label: "Coûts réduits", value: "38%", numericValue: 38, suffix: "%", order: 2 },
    { key: "uptime_platform", label: "Uptime plateforme", value: "99.98%", numericValue: 99.98, suffix: "%", order: 3 },
    { key: "satisfaction_clevel", label: "Satisfaction C-Level", value: "4.9/5", numericValue: 4.9, suffix: "/5", order: 4 },
    { key: "processes_automated", label: "Processus automatisés", value: "1 204", numericValue: 1204, suffix: "", order: 5 },
    { key: "agents_production", label: "Agents IA en production", value: "312", numericValue: 312, suffix: "", order: 6 },
    { key: "dashboards_decisional", label: "Dashboards décisionnels", value: "640", numericValue: 640, suffix: "", order: 7 },
    { key: "hours_saved_monthly", label: "Heures économisées / mois", value: "8 500 h", numericValue: 8500, suffix: " h", order: 8 },
  ];

  for (const m of metrics) {
    await db.metric.upsert({
      where: { key: m.key },
      update: m,
      create: m,
    });
  }
  console.log(`✓ ${metrics.length} métriques insérées`);

  // === Logos clients ===
  const logos = [
    { name: "NOVA BANK", sector: "Finance", order: 1 },
    { name: "AXIOM CORP", sector: "Conseil", order: 2 },
    { name: "HELIOS GROUP", sector: "Énergie", order: 3 },
    { name: "MERIDIAN", sector: "Logistique", order: 4 },
    { name: "QUANTUM LABS", sector: "Recherche", order: 5 },
    { name: "ORBITAL SYS", sector: "Aéro", order: 6 },
    { name: "VERTEX FINANCE", sector: "Finance", order: 7 },
    { name: "ZENITH RETAIL", sector: "Retail", order: 8 },
    { name: "POLARIS AI", sector: "Tech", order: 9 },
    { name: "NORDIC DATA", sector: "Data", order: 10 },
    { name: "CIPHER LABS", sector: "Cybersécurité", order: 11 },
    { name: "ATLAS SYSTEMS", sector: "Industrie", order: 12 },
  ];

  for (const l of logos) {
    await db.clientLogo.upsert({
      where: { name: l.name },
      update: l,
      create: l,
    });
  }
  console.log(`✓ ${logos.length} logos clients insérés`);

  console.log("✅ Seed terminé !");
}

seed()
  .catch((e) => {
    console.error("❌ Erreur seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
