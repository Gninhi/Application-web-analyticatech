import { test, expect, type Page } from "@playwright/test";

/**
 * Pile de cartes Services (/services) — contrôle qualité du « sticky stacking ».
 *
 * But : garantir qu'au scroll (lent, rapide, haut/bas), la carte active reste
 * nette (aucun blur), stable (aucune translation verticale animée excessive),
 * et que l'empilement/z-index est déterministe — sur desktop ET mobile.
 *
 * Protocole : scroll par incréments fins via `window.scrollTo`, puis
 * `settleAnimations` attend que les transform de décor soient stables
 * (aucune temporisation arbitraire). On échantillonne les styles calculés
 * de chaque carte et on capture des screenshots aux points de bascule.
 *
 * Seuils (mission) :
 *  - carte active : `filter: none` et blur (backdrop) effectif ≤ 0.5px
 *  - aucune transform animée sur l'article sticky (hors effet sticky normal)
 *  - parallaxe de décor bornée (amplitude faible, pas de « montée excessive »)
 *  - z-index croissant et déterministe
 *  - aucun saut de rect entre étapes consécutives (pas de CLS / jerk)
 *  - 0 erreur console
 *  - prefers-reduced-motion : parallaxe désactivée
 */

const DECK = '[data-testid="services-deck"]';
const CARD = '[data-testid="service-card"]';
const BG = '[data-testid="service-card-bg"]';
const PANEL = '[data-testid="service-card-panel"]';
const DEPTH = '[data-testid="service-card-depth"]';

const DESKTOP = { width: 1440, height: 1000 };
const MOBILE = { width: 390, height: 844 };
const STEP_PX = 60;

interface CardMetrics {
  index: number;
  rectTop: number;
  rectBottom: number;
  position: string;
  top: string;
  zIndex: string;
  transform: string;
  filter: string;
  panelBackdropFilter: string;
  panelTransform: string;
  bgTransform: string;
  depthOpacity: number | null;
}

/** Extrait les translateX/translateY (px) et le scale d'une matrice CSS. */
function parseMatrix(transform: string): { tx: number; ty: number; scale: number } {
  if (!transform || transform === "none") return { tx: 0, ty: 0, scale: 1 };
  const m = transform.match(/matrix\(([^)]+)\)/);
  if (!m) return { tx: 0, ty: 0, scale: 1 };
  const [a, _b, _c, _d, e, f] = m[1].split(",").map((v) => parseFloat(v.trim()));
  return { tx: Number.isFinite(e) ? e : 0, ty: Number.isFinite(f) ? f : 0, scale: a || 1 };
}

/** Mesure toutes les cartes de la pile dans le DOM. */
async function sampleCards(page: Page): Promise<CardMetrics[]> {
  return page.evaluate(
    ([cardSel, bgSel, panelSel, depthSel]) => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>(cardSel));
      return cards.map((card, i) => {
        const bg = card.querySelector<HTMLElement>(bgSel);
        const panel = card.querySelector<HTMLElement>(panelSel);
        const depth = card.querySelector<HTMLElement>(depthSel);
        const rect = card.getBoundingClientRect();
        const cs = (el: HTMLElement | null) => (el ? getComputedStyle(el) : null);
        const panelCs = cs(panel);
        const depthCs = cs(depth);
        return {
          index: i,
          rectTop: rect.top,
          rectBottom: rect.bottom,
          position: cs(card)?.position ?? "",
          top: cs(card)?.top ?? "",
          zIndex: cs(card)?.zIndex ?? "",
          transform: cs(card)?.transform ?? "",
          filter: cs(card)?.filter ?? "",
          panelBackdropFilter: panelCs?.backdropFilter ?? "",
          panelTransform: panelCs?.transform ?? "",
          bgTransform: cs(bg)?.transform ?? "",
          depthOpacity: depthCs?.opacity ? parseFloat(depthCs.opacity) : null,
        };
      });
    },
    [CARD, BG, PANEL, DEPTH] as [string, string, string, string],
  );
}

/** Attend que les transform du décor se stabilisent (spring terminé).
 *  Convergence par epsilon (delta < 0.5px sur 3 trames) : tolère la queue
 *  asymptotique du spring sans temporisation arbitraire. */
async function settleAnimations(page: Page, timeoutMs = 2500) {
  await page.evaluate(async (t) => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-testid="service-card-bg"]'));
    const parseTy = (el: HTMLElement) => {
      const m = getComputedStyle(el).transform.match(/matrix\(([^)]+)\)/);
      return m ? parseFloat(m[1].split(",")[5]) : 0;
    };
    let stableFrames = 0;
    let prev: number[] = cards.map(() => NaN);
    const t0 = performance.now();
    while (performance.now() - t0 < t) {
      await new Promise((r) => requestAnimationFrame(r));
      const cur = cards.map(parseTy);
      const maxDelta = Math.max(...cur.map((v, i) => Math.abs(v - (prev[i] || v))));
      if (maxDelta < 0.5) {
        stableFrames += 1;
        if (stableFrames >= 3) return;
      } else {
        stableFrames = 0;
      }
      prev = cur;
    }
  }, timeoutMs);
}

/** Scroll programmatique (instantané) puis stabilisation. */
async function scrollToAndSettle(page: Page, y: number) {
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: "auto" }), y);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
}

/** Carte active = carte au plus haut z-index ayant (quasi) atteint le viewport
 *  (seuil 90% : la carte suivante n'est « active » que lorsqu'elle est
 *  réellement entrée, pas à 1px du bord). */
function activeIndex(metrics: CardMetrics[], viewportH: number): number {
  const threshold = viewportH * 0.9;
  let idx = -1;
  for (const m of metrics) {
    if (m.rectTop < threshold) idx = m.index;
  }
  return idx;
}

/** Réalise la séquence de scroll + mesures + screenshots pour un viewport. */
async function runDeckScrollSequence(page: Page, viewportH: number, screenshotDir: string) {
  const deck = page.locator(DECK);
  await expect(deck).toBeVisible();

  const deckBox = await deck.boundingBox();
  expect(deckBox).toBeTruthy();
  const deckTop = deckBox?.y ?? 0;
  const deckHeight = deckBox?.height ?? 0;

  const cardCount = await page.locator(CARD).count();
  const stepPx = STEP_PX;
  const steps = Math.ceil(deckHeight / stepPx) + 4;

  const log: string[] = [];
  let prevActive = -1;
  const prevBgTy: Record<number, number> = {};
  const prevRectTop: Record<number, number> = {};

  for (let s = 0; s <= steps; s++) {
    const y = deckTop + Math.min(s * stepPx, deckHeight + viewportH);
    await scrollToAndSettle(page, y);
    await settleAnimations(page);

    const metrics = await sampleCards(page);
    const active = activeIndex(metrics, viewportH);
    const inc = metrics[active + 1] ?? null;

    const line: string[] = [`step=${s}`, `y=${Math.round(y)}`, `active=${active}`];

    if (active >= 0) {
      const a = metrics[active];
      const backdropBlur = /blur\(([\d.]+)px\)/.exec(a.panelBackdropFilter)?.[1] ?? "0";
      const bg = parseMatrix(a.bgTransform);
      const dRect = a.rectTop - (prevRectTop[active] ?? a.rectTop);
      prevRectTop[active] = a.rectTop;
      const dBgTy = bg.ty - (prevBgTy[active] ?? bg.ty);
      prevBgTy[active] = bg.ty;

      line.push(`filter=${a.filter}`);
      line.push(`backdrop=${backdropBlur}px`);
      line.push(`artTransform=${a.transform === "none" ? "none" : "MOVED"}`);
      line.push(`panelTransform=${a.panelTransform === "none" ? "none" : "MOVED"}`);
      line.push(`bgTy=${Math.round(bg.ty)}px dRect=${Math.round(dRect)} dBgTy=${Math.round(dBgTy)}`);
      line.push(`depth=${a.depthOpacity === null ? "n/a" : a.depthOpacity.toFixed(2)}`);
    }

    if (inc) {
      const bg = parseMatrix(inc.bgTransform);
      line.push(`inc${inc.index}bgTy=${Math.round(bg.ty)}px rectTop=${Math.round(inc.rectTop)}`);
    }

    log.push(line.join(" "));
    // (debug visible dans le rapport Playwright via les annotations de log)

    // Screenshot aux points de bascule entre cartes.
    if (active !== prevActive || s === 0 || s === steps) {
      await page.screenshot({
        path: `${screenshotDir}/card-${active === -1 ? "none" : active}-step-${String(s).padStart(2, "0")}.png`,
      });
      prevActive = active;
    }
  }

  // Mesures ciblées : échantillon fin autour du basculement de la carte 0 → 1.
  const fine: string[] = [];
  const baseY = deckTop + viewportH - 3 * stepPx;
  for (let s = 0; s <= 6; s++) {
    const y = baseY + s * stepPx;
    await scrollToAndSettle(page, y);
    await settleAnimations(page);
    const metrics = await sampleCards(page);
    const card0 = metrics[0];
    const card1 = metrics[1];
    const bg0 = parseMatrix(card0.bgTransform);
    const bg1 = parseMatrix(card1.bgTransform);
    fine.push(
      `y=${Math.round(y)} c0.top=${Math.round(card0.rectTop)} c1.top=${Math.round(card1.rectTop)} c0.bgTy=${Math.round(bg0.ty)} c1.bgTy=${Math.round(bg1.ty)} c1.depth=${card1.depthOpacity?.toFixed(2)}`,
    );
  }
  // Les mesures fines sont capturées dans le tableau `log` — pas de console.log en e2e
  log.push("FINE " + fine.join(" | "));

  return { log, cardCount };
}

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

for (const [label, viewport] of [
  ["desktop", DESKTOP],
  ["mobile", MOBILE],
] as const) {
  test.describe(`pile de cartes /services — ${label}`, () => {
    // Ce test est chargé (~90 pas de scroll + screenshots + échantillons fins)
    // et tourne en parallèle des autres specs → timeout dédié généreux.
    test.setTimeout(180_000);
    test.use({ viewport });

    test("empilement stable, net et déterministe au scroll", async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto("/services", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(CARD).first()).toBeVisible();
      await expect(page.locator(CARD)).toHaveCount(4);

      const dir = `e2e/screenshots/services-deck/${label}`;
      const { cardCount } = await runDeckScrollSequence(page, viewport.height, dir);
      expect(cardCount).toBe(4);

      // 1) Re-scroll lent complet pour les assertions finales.
      await scrollToAndSettle(page, 0);
      await settleAnimations(page);

      const viewportH = viewport.height;
      const deckBox = await page.locator(DECK).boundingBox();
      expect(deckBox).toBeTruthy();

      // 2) Assertions sur chaque position de bascule (carte i active).
      for (let i = 0; i < cardCount; i++) {
        const y = (deckBox?.y ?? 0) + i * viewportH;
        await scrollToAndSettle(page, y);
        await settleAnimations(page);
        const metrics = await sampleCards(page);
        const active = activeIndex(metrics, viewportH);

        // La carte i est bien celle qui domine le viewport à ce point.
        expect(active).toBe(i);
        const a = metrics[active];

        // Carte active : jamais de blur (filter), backdrop blur ≤ 0.5px.
        expect(a.filter).toBe("none");
        const backdropBlur = /blur\(([\d.]+)px\)/.exec(a.panelBackdropFilter)?.[1] ?? "0";
        expect(parseFloat(backdropBlur)).toBeLessThanOrEqual(0.5);

        // Aucune transform animée sur l'article sticky ni le panneau.
        expect(a.transform).toBe("none");
        expect(a.panelTransform).toBe("none");

        // z-index croissant et déterministe.
        const z = metrics.map((m) => parseInt(m.zIndex, 10));
        expect(z).toEqual(z.map((v, idx) => idx + 1));

        // Le panneau reste entièrement contenu dans sa carte (aucun contenu
        // coupé par overflow-hidden), quel que soit le décalage sticky de la
        // carte active (top = gap × i → sa carte dépasse naturellement du
        // bas du viewport, mais le panneau ne doit pas être rogné).
        const cardBox = await page.locator(CARD).nth(active).boundingBox();
        expect(cardBox).toBeTruthy();
        const panelBox = await page.locator(PANEL).nth(active).boundingBox();
        expect(panelBox).toBeTruthy();
        if (panelBox && cardBox) {
          expect(panelBox.y).toBeGreaterThanOrEqual(cardBox.y - 1);
          expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(
            cardBox.y + cardBox.height + 1,
          );
        }
      }

      // 3) Stabilité : parallaxe bornée (amplitude faible) sur le décor.
      await scrollToAndSettle(page, deckBox?.y ?? 0);
      await settleAnimations(page);
      const m0 = await sampleCards(page);
      const first = parseMatrix(m0[0].bgTransform);
      await scrollToAndSettle(page, (deckBox?.y ?? 0) + viewportH);
      await settleAnimations(page);
      const m1 = await sampleCards(page);
      const second = parseMatrix(m1[0].bgTransform);
      const parallaxRange = Math.abs(second.ty - first.ty);
      expect(parallaxRange).toBeLessThanOrEqual(32);

      // 4) Ancrage : pendant que la carte 1 glisse pour recouvrir la carte 0,
      //    la carte 0 épinglée reste immobile (±1px) et la carte 1 suit le
      //    scroll 1:1 (delta = stepPx, aucun saut/téléport) tant qu'elle n'est
      //    pas épinglée, puis reste immobile une fois épinglée (delta = 0).
      //    L'étape de transition (dernier incrément vers le pin) est exclue.
      const pinGap = Math.min(56, Math.max(16, viewportH * 0.04));
      const pinTop = pinGap * 1; // carte 1 : top = gap × 1
      const startY = (deckBox?.y ?? 0) + viewportH - 5 * STEP_PX;
      const pinnedRects: number[] = [];
      const slidingDeltas: number[] = [];
      const pinnedDeltas: number[] = [];
      let prevSliding = 0;
      for (let s = 0; s < 9; s++) {
        await scrollToAndSettle(page, startY + s * STEP_PX);
        await settleAnimations(page);
        const metrics = await sampleCards(page);
        pinnedRects.push(metrics[0].rectTop);
        if (s > 0) {
          const d = metrics[1].rectTop - prevSliding;
          const nowPinned = metrics[1].rectTop <= pinTop + 1;
          const wasPinned = prevSliding <= pinTop + 1;
          if (nowPinned && wasPinned) pinnedDeltas.push(d);
          else if (!nowPinned) slidingDeltas.push(d);
        }
        prevSliding = metrics[1].rectTop;
      }
      for (const r of pinnedRects) {
        expect(Math.abs(r - pinnedRects[0])).toBeLessThanOrEqual(1);
      }
      for (const d of slidingDeltas) {
        // d est négatif (la carte monte avec le scroll) → comparaison en
        // valeur absolue : la carte recouvrante doit suivre le scroll 1:1.
        expect(Math.abs(Math.abs(d) - STEP_PX)).toBeLessThanOrEqual(2);
      }
      for (const d of pinnedDeltas) {
        // Une fois épinglée, la carte recouvrante ne bouge plus (delta = 0).
        expect(Math.abs(d)).toBeLessThanOrEqual(1);
      }

      expect(errors).toEqual([]);
    });

    test("prefers-reduced-motion : parallaxe désactivée, aucun mouvement décor", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      const errors = collectErrors(page);
      await page.goto("/services", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(CARD)).toHaveCount(4);

      const deckBox = await page.locator(DECK).boundingBox();
      expect(deckBox).toBeTruthy();

      await scrollToAndSettle(page, (deckBox?.y ?? 0) + viewport.height);
      await settleAnimations(page);
      const metrics = await sampleCards(page);

      // Le décor ne doit pas bouger (translateY stable) en reduced-motion.
      const bg0 = parseMatrix(metrics[0].bgTransform);
      expect(Math.abs(bg0.ty)).toBeLessThanOrEqual(2);
      const bg1 = parseMatrix(metrics[1].bgTransform);
      expect(Math.abs(bg1.ty)).toBeLessThanOrEqual(2);

      expect(errors).toEqual([]);
    });
  });
}