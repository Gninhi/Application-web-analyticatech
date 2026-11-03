import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Mail } from "lucide-react";
import { IconBadge } from "@/components/ui/IconBadge";

describe("IconBadge", () => {
  it("rend une pastille décorative au style commun (taille, ton, pictogramme)", () => {
    const html = renderToStaticMarkup(<IconBadge icon={Mail} size="lg" tone="link" />);
    expect(html).toContain('class="icon-badge"');
    expect(html).toContain('data-size="lg"');
    expect(html).toContain('data-tone="link"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("lucide-mail");
    expect(html).toContain("h-6 w-6");
  });

  it("expose un libellé accessible et une couleur propre si fournis", () => {
    const html = renderToStaticMarkup(<IconBadge icon={Mail} label="E-mail" color="#F26D3D" />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="E-mail"');
    expect(html).toContain("--badge-c:#F26D3D");
  });
});

describe("Icônes des services", () => {
  it("chaque service a son propre pictogramme (clé de contenu reconnue)", async () => {
    const { SERVICE_ICONS } = await import("@/lib/content/services");
    const { FALLBACK_SERVICES_FR } = await import("@/lib/content/fallbacks");
    const icons = FALLBACK_SERVICES_FR.map((s) => SERVICE_ICONS[s.iconKey]);
    expect(icons.every(Boolean)).toBe(true);
    expect(new Set(icons).size).toBe(FALLBACK_SERVICES_FR.length);
  });
});
