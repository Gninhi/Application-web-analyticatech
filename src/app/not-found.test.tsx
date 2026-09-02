import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import NotFoundPage from "@/app/not-found";
import { I18nProvider } from "@/lib/i18n";

describe("NotFoundPage (404)", () => {
  it("rend la page 404 en français par défaut", () => {
    const html = renderToStaticMarkup(
      <I18nProvider locale="fr">
        <NotFoundPage />
      </I18nProvider>
    );

    expect(html).toContain("404");
    expect(html).toContain("Nœud système introuvable");
    expect(html).toContain("RETOURNER AU TERMINAL PRINCIPAL");
    expect(html).toContain("CONTACTER L&#x27;ÉQUIPE");
    expect(html).toContain("Terminal d&#x27;accueil");
    expect(html).toContain("Services &amp; Expertise");
    expect(html).toContain("Solutions sectorielles");
    expect(html).toContain("Rapports &amp; Insights");
  });

  it("rend la page 404 en anglais quand la locale est 'en'", () => {
    const html = renderToStaticMarkup(
      <I18nProvider locale="en">
        <NotFoundPage />
      </I18nProvider>
    );

    expect(html).toContain("404");
    expect(html).toContain("System Node Not Found");
    expect(html).toContain("RETURN TO MAIN TERMINAL");
    expect(html).toContain("CONTACT THE TEAM");
    expect(html).toContain("Main Terminal");
    expect(html).toContain("Services &amp; Capabilities");
    expect(html).toContain("Industry Solutions");
    expect(html).toContain("Reports &amp; Insights");
    expect(html).toContain('href="/en"');
    expect(html).toContain('href="/en/services"');
  });
});
