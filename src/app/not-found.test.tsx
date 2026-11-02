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
    expect(html).toContain("Page introuvable");
    expect(html).toContain("Retour à l&#x27;accueil");
    expect(html).toContain("Me contacter");
    expect(html).toContain("Accueil");
    expect(html).toContain("Services &amp; Expertise");
    expect(html).toContain("Solutions sectorielles");
    expect(html).toContain("Articles");
  });

  it("rend la page 404 en anglais quand la locale est 'en'", () => {
    const html = renderToStaticMarkup(
      <I18nProvider locale="en">
        <NotFoundPage />
      </I18nProvider>
    );

    expect(html).toContain("404");
    expect(html).toContain("Page not found");
    expect(html).toContain("Back to home");
    expect(html).toContain("Contact me");
    expect(html).toContain("Home");
    expect(html).toContain("Services &amp; Capabilities");
    expect(html).toContain("Industry Solutions");
    expect(html).toContain("Articles");
    expect(html).toContain('href="/en"');
    expect(html).toContain('href="/en/services"');
  });
});
