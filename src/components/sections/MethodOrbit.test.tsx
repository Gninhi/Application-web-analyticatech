import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MethodOrbit } from "@/components/sections/MethodOrbit";
import { Search, FlaskConical, Factory, TrendingUp } from "lucide-react";

const MOCK_NODES = [
  {
    number: "01",
    title: "Découverte & Cadrage",
    duration: "Semaine 1-2",
    icon: Search,
    color: "#F26D3D",
  },
  {
    number: "02",
    title: "POC en Conditions Réelles",
    duration: "Semaine 3-4",
    icon: FlaskConical,
    color: "#38BDF8",
  },
  {
    number: "03",
    title: "Industrialisation",
    duration: "Mois 2-3",
    icon: Factory,
    color: "#A855F7",
  },
  {
    number: "04",
    title: "Run & Amélioration",
    duration: "Continu",
    icon: TrendingUp,
    color: "#F59E0B",
  },
];

describe("MethodOrbit — Système Orbital & Synergie des 4 Phases", () => {
  it("rend le composant orbital avec role tablist et accessibilité ARIA", () => {
    const html = renderToStaticMarkup(
      <MethodOrbit
        nodes={MOCK_NODES}
        activeIndex={0}
        onSelect={vi.fn()}
        centerLabel="07 — Méthode"
      />
    );

    expect(html).toContain('role="tablist"');
    expect(html).toContain('aria-label="07 — Méthode"');
  });

  it("rend les 4 phases avec l'étape 01 active et les autres inactives", () => {
    const html = renderToStaticMarkup(
      <MethodOrbit
        nodes={MOCK_NODES}
        activeIndex={0}
        onSelect={vi.fn()}
        centerLabel="07 — Méthode"
      />
    );

    expect(html).toContain("01");
    expect(html).toContain("Découverte &amp; Cadrage");
    expect(html).toContain("02");
    expect(html).toContain("POC en Conditions Réelles");
    expect(html).toContain("03");
    expect(html).toContain("Industrialisation");
    expect(html).toContain("04");
    expect(html).toContain("Run &amp; Amélioration");

    // L'étape 01 est marquée aria-selected="true"
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-selected="false"');
  });

  it("rend le hub central avec le label et le micro-badge vivant SYS.LIVE", () => {
    const html = renderToStaticMarkup(
      <MethodOrbit
        nodes={MOCK_NODES}
        activeIndex={1}
        onSelect={vi.fn()}
        centerLabel="07 — Méthode"
      />
    );

    expect(html).toContain("07 — Méthode");
    expect(html).toContain("SYS.LIVE");
    expect(html).toContain("orbit-hub-halo");
    expect(html).toContain("orbit-sonar-pulse");
  });

  it("projette le faisceau d'énergie orienté vers la phase sélectionnée", () => {
    const html = renderToStaticMarkup(
      <MethodOrbit
        nodes={MOCK_NODES}
        activeIndex={2}
        onSelect={vi.fn()}
        centerLabel="07 — Méthode"
      />
    );

    // À l'index 2 (sur 4), l'angle est (360/4)*2 = 180deg
    expect(html).toContain("rotate(180deg)");
    // Contient la couleur du nœud 03 (#A855F7)
    expect(html).toContain("#A855F7");
    // Contient le halo et l'animation de flux laser
    expect(html).toContain("laser-stream");
  });

  it("intègre les classes bi-thèmes pour s'adapter au thème clair et sombre", () => {
    const html = renderToStaticMarkup(
      <MethodOrbit
        nodes={MOCK_NODES}
        activeIndex={0}
        onSelect={vi.fn()}
        centerLabel="07 — Méthode"
      />
    );

    // Classes et variables bi-thèmes présentes
    expect(html).toContain("dark:fill-white/80");
    expect(html).toContain("dark:bg-[#06070B]/80");
    expect(html).toContain("dark:border-white/15");
    expect(html).toContain("dark:opacity-20");
    expect(html).toContain("var(--glass-card-bg)");
    expect(html).toContain("var(--orbit-r)");
  });
});
