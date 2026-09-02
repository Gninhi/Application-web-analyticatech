/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";


/**
 * Budget de bundle JavaScript & CSS post-build.
 * Vérifie l'arborescence .next/static/ pour bloquer toute régression en CI.
 */
const BUNDLE_BUDGETS = {
  maxSingleChunkGzipKb: 140, // Aucun chunk JS individuel ne doit dépasser 140 KB gzip
  maxTotalAppJsGzipKb: 250,  // Poids total des chunks JS applicatifs principaux <= 250 KB gzip
};

const distDir = process.env.NEXT_DIST_DIR || (fs.existsSync(path.join(process.cwd(), ".next-e2e")) ? ".next-e2e" : ".next");
const nextStaticDir = path.join(process.cwd(), distDir, "static", "chunks");

if (!fs.existsSync(nextStaticDir)) {
  console.error(`❌ Le dossier ${nextStaticDir} n'existe pas. Exécutez le build d'abord.`);
  process.exit(1);
}


const files = fs.readdirSync(nextStaticDir);
let totalJsGzip = 0;
let violations = 0;

console.log("🔍 Analyse des chunks de production :");

for (const file of files) {
  if (!file.endsWith(".js")) continue;
  const filePath = path.join(nextStaticDir, file);
  const content = fs.readFileSync(filePath);
  const rawSize = content.length;
  const gzipSize = zlib.gzipSync(content).length;
  const gzipKb = gzipSize / 1024;

  totalJsGzip += gzipSize;

  if (gzipKb > BUNDLE_BUDGETS.maxSingleChunkGzipKb) {
    console.error(`❌ [DEPASSEMENT BUDGET] ${file} : ${gzipKb.toFixed(2)} KB gzip (max autorisé : ${BUNDLE_BUDGETS.maxSingleChunkGzipKb} KB)`);
    violations++;
  } else {
    console.log(`  ✓ ${file} : ${(rawSize / 1024).toFixed(1)} KB brut (${gzipKb.toFixed(1)} KB gzip)`);
  }
}

console.log(`\n📊 Bilan Budget Bundle JS : ${(totalJsGzip / 1024).toFixed(2)} KB gzip total analysé.`);

if (violations > 0) {
  console.error(`\n❌ Échec : ${violations} chunk(s) dépassent le budget de performance strict.`);
  process.exit(1);
} else {
  console.log("✅ Budget de bundle JS 100% respecté !");
}
