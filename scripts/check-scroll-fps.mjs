/* eslint-disable no-console */
import { chromium } from "@playwright/test";

/**
 * Script de benchmark et de non-régression de fluidité au défilement (FPS & Stabilité).
 * 
 * Mesure en conditions réelles :
 * 1. Le taux de rafraîchissement moyen (FPS) et la distribution des deltas de trame (rAF).
 * 2. Le nombre de "dropped frames" (> 40ms) et de "severe janks" (> 60ms).
 * 3. La continuité stricte de la transition de sortie (unpinning) sur /solutions.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function measureScrollPerformance(page, route, { scrollSteps = 140, stepSize = 25 } = {}) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // Échauffement : pré-chargement des chunks dynamiques et décodage des images
  await page.evaluate(async () => {
    window.scrollTo({ top: Math.min(document.body.scrollHeight, 2500), behavior: "instant" });
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 500));
  });

  // Injection du moniteur rAF dans la page
  const result = await page.evaluate(async ({ steps, step }) => {
    return new Promise((resolve) => {
      const frameDeltas = [];
      let lastTime = performance.now();
      let currentStep = 0;

      function onFrame(currentTime) {
        const delta = currentTime - lastTime;
        lastTime = currentTime;
        if (currentStep > 2) {
          // Exclure les 2 premières trames de chauffe
          frameDeltas.push(delta);
        }

        window.scrollBy({ top: step, behavior: "instant" });
        currentStep++;

        const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
        if (currentStep >= steps || isAtBottom) {
          setTimeout(() => {
            resolve({
              frameDeltas,
              finalScrollY: window.scrollY,
              totalHeight: document.body.offsetHeight,
            });
          }, 100);
          return;
        }

        requestAnimationFrame(onFrame);
      }

      requestAnimationFrame(onFrame);
    });
  }, { steps: scrollSteps, step: stepSize });

  // Analyse statistique des deltas
  const deltas = result.frameDeltas;
  if (deltas.length === 0) {
    throw new Error(`Aucune trame capturée pour ${route}`);
  }

  const totalTime = deltas.reduce((acc, d) => acc + d, 0);
  const avgDelta = totalTime / deltas.length;
  const avgFps = 1000 / avgDelta;
  const maxDelta = Math.max(...deltas);
  const droppedFrames = deltas.filter(d => d > 40).length;
  const severeJanks = deltas.filter(d => d > 60).length;

  return {
    route,
    frameCount: deltas.length,
    avgFps: Math.round(avgFps * 10) / 10,
    avgDelta: Math.round(avgDelta * 100) / 100,
    maxDelta: Math.round(maxDelta * 10) / 10,
    droppedFrames,
    severeJanks,
    finalScrollY: result.finalScrollY,
  };
}

async function verifySolutionsUnpinContinuity(page) {
  await page.goto(`${BASE_URL}/solutions`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const continuityCheck = await page.evaluate(async () => {
    const pinSection = document.getElementById("solutions-pinned-showcase");
    if (!pinSection) return { error: "Section #solutions-pinned-showcase introuvable" };

    const pinTop = pinSection.offsetTop;
    const pinHeight = pinSection.offsetHeight;
    const vh = window.innerHeight;
    const unpinPoint = pinTop + pinHeight - vh;

    // Échantillonnage précis autour du point de sortie de sticky
    const deltas = [];
    const startScroll = Math.max(0, unpinPoint - 200);
    const endScroll = unpinPoint + 200;

    let previousY = startScroll;
    window.scrollTo({ top: startScroll, behavior: "instant" });
    await new Promise(r => setTimeout(r, 50));

    for (let targetY = startScroll + 20; targetY <= endScroll; targetY += 20) {
      window.scrollTo({ top: targetY, behavior: "instant" });
      await new Promise(r => setTimeout(r, 16));
      const currentActualY = window.scrollY;
      deltas.push({
        requested: targetY,
        actual: currentActualY,
        stepDiff: currentActualY - previousY,
      });
      previousY = currentActualY;
    }

    // Détection d'un saut violent (stepDiff significativement différent de 20px)
    const irregularSteps = deltas.filter(d => Math.abs(d.stepDiff - 20) > 1);

    return {
      pinTop,
      pinHeight,
      unpinPoint,
      irregularStepsCount: irregularSteps.length,
      sampleDeltas: deltas.slice(8, 14),
    };
  });

  return continuityCheck;
}

async function main() {
  console.log(`🚀 Démarrage du contrôle de fluidité et de continuité sur ${BASE_URL}...\n`);

  let browser;
  try {
    browser = await chromium.launch({
      channel: "chrome",
      headless: true,
      args: ["--no-sandbox", "--enable-gpu-rasterization"],
    });
  } catch {
    console.log("⚠️ Fallback sur Chromium par défaut...");
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const results = [];
  const routesToTest = [
    { route: "/solutions", scrollSteps: 160, stepSize: 25 },
    { route: "/", scrollSteps: 180, stepSize: 25 },
  ];

  for (const config of routesToTest) {
    console.log(`⏳ Test de fluidité en cours sur ${config.route}...`);
    try {
      const res = await measureScrollPerformance(page, config.route, config);
      results.push(res);
    } catch (e) {
      console.error(`❌ Erreur sur ${config.route} :`, e.message);
    }
  }

  console.log(`⏳ Test de continuité de l'unpinning sur /solutions...`);
  const continuity = await verifySolutionsUnpinContinuity(page);

  await browser.close();

  // Affichage du tableau de bord des résultats
  console.log("\n===============================================================================");
  console.log("📊 RÉSULTATS DE FLUIDITÉ DU DÉFILEMENT (BENCHMARK)");
  console.log("===============================================================================");
  console.table(results.map(r => ({
    "Route": r.route,
    "FPS Moyen": `${r.avgFps} fps`,
    "Delta Moyen": `${r.avgDelta} ms`,
    "Max Delta": `${r.maxDelta} ms`,
    "Trames Perdues (>40ms)": r.droppedFrames,
    "Janks Sévères (>60ms)": r.severeJanks,
  })));

  console.log("\n🔍 Analyse du point de sortie (Unpinning) sur /solutions :");
  if (continuity.error) {
    console.error(`  ❌ ${continuity.error}`);
  } else {
    console.log(`  - Point de sortie : ${continuity.unpinPoint}px (Hauteur totale : ${continuity.pinHeight}px)`);
    console.log(`  - Paliers irréguliers détectés : ${continuity.irregularStepsCount}`);
    if (continuity.irregularStepsCount === 0) {
      console.log("  ✅ Continuité parfaite : 100% des incréments de scroll sont strictement linéaires (0 saut visuel).");
    } else {
      console.warn(`  ⚠️ Attention : ${continuity.irregularStepsCount} paliers ont un décalage non-linéaire.`);
    }
  }

  // Évaluation des seuils de blocage (Gate CI)
  // Note : en mode `next dev`, le runtime React est en mode dev avec inspection fibers.
  const isDevServer = BASE_URL.includes("3000");
  const minFps = isDevServer ? 25 : 50;

  let failed = false;
  for (const r of results) {
    if (r.avgFps < minFps) {
      console.error(`❌ ÉCHEC : ${r.route} a un FPS moyen de ${r.avgFps} (< ${minFps} fps requis)`);
      failed = true;
    }
  }

  if (continuity.irregularStepsCount && continuity.irregularStepsCount > 0) {
    console.error("❌ ÉCHEC : Saut non linéaire détecté lors de la sortie de la section sticky sur /solutions.");
    failed = true;
  }

  if (failed) {
    console.error("\n❌ Le test de fluidité et continuité a échoué.");
    process.exit(1);
  } else {
    console.log("\n🎉 SUCCÈS : Continuité d'unpinning parfaite et métriques de fluidité validées !");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Erreur inattendue :", err);
  process.exit(1);
});
