import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Orbit3DMethod } from "@/components/ui/orbit-3d-method";
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

describe("Orbit3DMethod — Système Orbital 3D & Hub Central", () => {
  it("rend le composant avec perspective 3D et structure accessible sans erreur SSR", () => {
    const html = renderToStaticMarkup(
      <Orbit3DMethod
        nodes={MOCK_NODES}
        activeIndex={0}
        onSelect={vi.fn()}
        centerLabel="07 — Méthode"
      />
    );

    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="07 — Méthode"');
    expect(html).toContain('perspective:1200');
    expect(html).toContain('transform-style:preserve-3d');
  });

  it("affiche le hub central avec l'emblème MÉTHODE et le dock de sélection", () => {
    const html = renderToStaticMarkup(
      <Orbit3DMethod
        nodes={MOCK_NODES}
        activeIndex={1}
        onSelect={vi.fn()}
      />
    );

    expect(html).not.toContain("SYS.LIVE");
    expect(html).toContain("MÉTHODE");
    expect(html).toContain("direct aux phases");
  });

  it("rend les 4 nœuds orbitaux avec leurs statuts d'accessibilité ARIA", () => {
    const html = renderToStaticMarkup(
      <Orbit3DMethod
        nodes={MOCK_NODES}
        activeIndex={2}
        onSelect={vi.fn()}
      />
    );

    expect(html).toContain("01");
    expect(html).toContain("02");
    expect(html).toContain("03");
    expect(html).toContain("04");

    // Nœud 03 actif
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-selected="false"');
  });

  it("intègre les anneaux concentriques 3D et le support bi-thème", () => {
    const html = renderToStaticMarkup(
      <Orbit3DMethod
        nodes={MOCK_NODES}
        activeIndex={0}
        onSelect={vi.fn()}
      />
    );

    expect(html).toContain("dark:border-white/10");
    expect(html).toContain("dark:bg-[#06070B]");
    expect(html).toContain("rotateX");
    expect(html).toContain("rotateZ");
  });

  it("matérialise le système orbital avec le Hub central, les capsules technologiques et le faisceau d'énergie", () => {
    const html = renderToStaticMarkup(
      <Orbit3DMethod
        nodes={MOCK_NODES}
        activeIndex={0}
        onSelect={vi.fn()}
      />
    );

    // Cœur cybernétique
    expect(html).toContain("lucide-waypoints");
    // Faisceau laser dynamique
    expect(html).toContain("orbit-beam-grad");
    expect(html).toContain("animate-laser-stream");
    // Forme des capsules
    expect(html).toContain("Découverte &amp; Cadrage");
  });
});
