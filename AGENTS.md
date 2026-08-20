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

## Data & architecture

- i18n via `useI18n()` (`src/lib/i18n/`); site content (nav, metrics, posts…) via `ContentProvider` (`src/components/providers/ContentProvider.tsx`). `MetricDTO` drives the home "Data Console" bento.
- DB is Supabase Postgres through the Prisma pooler URL (`DATABASE_URL` / `DIRECT_URL`; `DATABASE_SSL`). Prisma 7 uses the new `prisma-client` generator emitting into **`src/generated/prisma`** — generated, never hand-edit. `postinstall` and `vercel-build` run `prisma generate`; `npm run seed` (`tsx prisma/seed.ts`) seeds content.
- Env keys (`.env.example`): `DATABASE_URL`, `DIRECT_URL`, `DATABASE_SSL`, `RESEND_API_KEY` (email), `MAIL_FROM`/`MAIL_TO`, `IP_SALT`, `ALLOWED_ORIGINS`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_VERSION`. `NEXT_PUBLIC_*` are public — never put secrets there.
- Vercel: `next.config.ts` sets `output: "standalone"` only off-Vercel, and reads `NEXT_DIST_DIR` for the output dir.
