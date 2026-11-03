# AGENTS.md

Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind v4 + framer-motion 12. Prisma 7 → Postgres (Supabase). Single app, not a monorepo. UI copy/comments are in French — keep it that way.

## Commands

```bash
npm run dev          # next dev -p 3000
npm run lint         # eslint .   (react-hooks/set-state-in-effect is an ERROR; no-console / no-explicit-any / no-non-null-assertion are warnings)
npm run typecheck    # tsc --noEmit
npm run test:unit    # vitest run
npm run test:e2e     # playwright test
npm test             # = test:unit puis test:e2e
```

Focused verification:
```bash
npx vitest run src/components/ui/LazySection.test.tsx
npx playwright test e2e/scroll-stability.spec.ts
```

Finish work with `lint → typecheck → test:unit`; run e2e (or at least the touched spec) when behavior changed. The e2e `webServer` builds into a **separate** `.next-e2e` dir (`NEXT_DIST_DIR=.next-e2e`, port 3210) so it never clobbers your prod build; `reuseExistingServer` is on locally.

## Testing quirks

- Vitest runs in **node** env — no jsdom, no testing-library. Component tests render via `react-dom/server` `renderToStaticMarkup`. Config aliases `@` → `src` and `server-only` → `tests/mocks/server-only.ts`; include glob is `src/**/*.test.{ts,tsx}`.
- E2e uses the **real Supabase data** with offline fallbacks; specs stay green in resilience mode.
- `globals.css` sets `scroll-behavior: smooth` globally → scroll-position e2e tests must use `document.documentElement.scrollTo({ top, behavior: "instant" })`.
- Lazy sections: assert full mount with `[data-lazy-mounted='false']` count → 0 (see `e2e/scroll-stability.spec.ts`).

## Frontend conventions (hard-earned)

- Home sections are code-split (`dynamic()`) + `LazySection` (mount-on-approach: IO `rootMargin` 1000 px + idle preload ~2.5 viewports). **Never unmount a section once mounted; never do `isInView && <Section/>`.** Placeholders must reserve height via `SectionSkeleton` `minHeight`/`mobileMinHeight` (per-breakpoint CSS vars) or the page gets CLS. Same skeleton sizes drive both the `dynamic().loading` fallback and the `LazySection` placeholder.
- **Reveal on mount, not `whileInView`** — sections are pre-mounted off-screen, so `whileInView` fires late and leaves empty space on fast scroll. Converted everywhere on the home page and in shared primitives (`SectionHeading`). Dedicated views (`/services`, `/solutions`, `/a-propos`) still use `whileInView` intentionally — don't "fix" them.
- **Avoid `AnimatePresence mode="wait"`** for in-place panel swaps (height jumps). Use grid-stack crossfade: all panels stacked `col-start-1 row-start-1` in the same grid, `motion.div initial={false}` + opacity animate, inactive panels `inert={!isActive}` + `pointer-events-none` (see `LivingSystemGraph`, `AgentoryMethod`, `BeforeAfterDemo`).
- Animated counters must show the **final value on SSR/first render** (no visible "0"); animate 0→value on mount, snap on later value changes. Clock/date-time components must be SSR-stable (lazy state init + placeholder, no `suppressHydrationWarning`).
- The `react-hooks/set-state-in-effect` lint rule blocks synchronous setState in an effect body — wrap in `requestAnimationFrame`/`setTimeout` callbacks.
- Animations: transform/opacity only, respect `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` in `SiteShell`). No WebGL/Three.js in this app.
- Design tokens: accent orange `#F26D3D`, `glass-card` / `glass-strong` utilities, mono uppercase eyebrow tags. Match existing patterns; don't redesign.
- **Brand typography & logotype** (design system artifact « Analyticatech »): only **Manrope** 600/700/800 (titles, `font-display`, h1–h4) and **Inter** 400/500/600 (everything else), self-hosted from `src/app/fonts/` via `next/font/local` — never add another web font. `font-mono` is kept for eyebrow tags but maps to Inter; real code uses `font-code` (system monospace). Use only those weights (no `font-bold` on Inter text, no `font-medium` on Manrope). `@theme inline` font vars don't exist at runtime: base CSS rules use `var(--font-inter)` / `var(--font-manrope)` directly. Logo = `BrandLogo` (`/public/brand/*.svg`, official A-flux files; `variant="mot"` below 160 px wide); no text-built logotype. `public/logo.svg` (favicon) is provisional until the monogram is designed.

## Data & architecture

- i18n via `useI18n()` (`src/lib/i18n/`); site content (nav, services, solutions, posts, legal…) via `ContentProvider` (`src/components/providers/ContentProvider.tsx`).
- **Editorial content lives in code only** (`src/lib/content/*`, `src/locales/*`, `src/data/*`, `public/llms.txt`); the `*.service.ts` getters return these constants and never read the DB. The DB holds only `ContactRequest` and the security lists (`BlockedEmailDomain`, `SuspiciousUAPattern`); the old content tables were dropped on 2026-11-02 (migration `20261102210000_drop_stale_content_tables`) and `prisma/seed.ts` only seeds the security lists — don't recreate content tables. Migrations are applied through Supabase, not `prisma migrate deploy`. `/api/cron/purge-contacts` (Vercel Cron, `vercel.json`, requires `CRON_SECRET`) deletes contact requests 3 years after their last update, as promised in the privacy policy.
- **Content charter** (enforced by `src/lib/content/content-charter.test.ts`): Analyticatech is a one-person SAS founded in 2024. No unmeasured result figures or percentages, no fictitious team ("nos architectes"), no certification it doesn't hold (SecNumCloud/ISO/SOC 2), no Strasbourg office, no "< 2h / 24h ouvrées" promises, no testimonials. Delays come only from `src/data/commitments.ts`; legal revision date from `src/lib/content/legal.ts`. Solutions = real projects (Ciblioo, ContentOps Harness, AVIE) then "pistes à construire" clearly labelled.
- DB is Supabase Postgres through the Prisma pooler URL (`DATABASE_URL` / `DIRECT_URL`; `DATABASE_SSL`). Prisma 7 uses the new `prisma-client` generator emitting into **`src/generated/prisma`** — generated, never hand-edit. `postinstall` and `vercel-build` run `prisma generate`.
- Env keys (`.env.example`): `DATABASE_URL`, `DIRECT_URL`, `DATABASE_SSL`, `RESEND_API_KEY` (email), `MAIL_FROM`/`MAIL_TO`, `IP_SALT`, `ALLOWED_ORIGINS`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_VERSION`. `NEXT_PUBLIC_*` are public — never put secrets there.
- Vercel: `next.config.ts` sets `output: "standalone"` only off-Vercel, and reads `NEXT_DIST_DIR` for the output dir.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
