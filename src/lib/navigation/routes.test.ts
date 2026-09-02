import { describe, expect, it } from "vitest";
import { pathToView, viewToPath, getAlternatePath, getLocaleFromPath } from "./routes";

describe("viewToPath", () => {
  it("mappe les vues statiques vers leurs routes FR par défaut", () => {
    expect(viewToPath("home")).toBe("/");
    expect(viewToPath("services")).toBe("/services");
    expect(viewToPath("solutions")).toBe("/solutions");
    expect(viewToPath("blog")).toBe("/insights");
    expect(viewToPath("contact")).toBe("/contact");
    expect(viewToPath("rgpd")).toBe("/confidentialite");
    expect(viewToPath("legal")).toBe("/mentions-legales");
    expect(viewToPath("about")).toBe("/a-propos");
  });

  it("mappe les vues statiques vers leurs routes EN avec préfixe", () => {
    expect(viewToPath("home", undefined, "en")).toBe("/en");
    expect(viewToPath("services", undefined, "en")).toBe("/en/services");
    expect(viewToPath("solutions", undefined, "en")).toBe("/en/solutions");
    expect(viewToPath("blog", undefined, "en")).toBe("/en/insights");
    expect(viewToPath("contact", undefined, "en")).toBe("/en/contact");
    expect(viewToPath("about", undefined, "en")).toBe("/en/a-propos");
  });

  it("construit les routes de détail par identifiant (FR et EN)", () => {
    expect(viewToPath("service-detail", "01")).toBe("/services/01");
    expect(viewToPath("service-detail", "01", "en")).toBe("/en/services/01");
    expect(viewToPath("solution-detail", "logistics-ai")).toBe("/solutions/logistics-ai");
    expect(viewToPath("solution-detail", "logistics-ai", "en")).toBe("/en/solutions/logistics-ai");
    expect(viewToPath("blog-detail", "rag-evaluation")).toBe("/insights/rag-evaluation");
    expect(viewToPath("blog-detail", "rag-evaluation", "en")).toBe("/en/insights/rag-evaluation");
  });

  it("encode l'identifiant dans l'URL", () => {
    expect(viewToPath("solution-detail", "retail bi")).toBe("/solutions/retail%20bi");
    expect(viewToPath("solution-detail", "retail bi", "en")).toBe("/en/solutions/retail%20bi");
  });
});

describe("pathToView", () => {
  it("déduit la vue active depuis les chemins FR et EN", () => {
    expect(pathToView("/")).toBe("home");
    expect(pathToView("/en")).toBe("home");
    expect(pathToView("/en/")).toBe("home");
    expect(pathToView("/services")).toBe("services");
    expect(pathToView("/en/services")).toBe("services");
    expect(pathToView("/services/03")).toBe("services");
    expect(pathToView("/en/services/03")).toBe("services");
    expect(pathToView("/solutions")).toBe("solutions");
    expect(pathToView("/en/solutions")).toBe("solutions");
    expect(pathToView("/insights")).toBe("blog");
    expect(pathToView("/en/insights")).toBe("blog");
    expect(pathToView("/contact")).toBe("contact");
    expect(pathToView("/en/contact")).toBe("contact");
    expect(pathToView("/confidentialite")).toBe("rgpd");
    expect(pathToView("/en/confidentialite")).toBe("rgpd");
    expect(pathToView("/mentions-legales")).toBe("legal");
    expect(pathToView("/en/mentions-legales")).toBe("legal");
    expect(pathToView("/a-propos")).toBe("about");
    expect(pathToView("/en/a-propos")).toBe("about");
  });
});

describe("getLocaleFromPath", () => {
  it("détecte la locale depuis le chemin", () => {
    expect(getLocaleFromPath("/")).toBe("fr");
    expect(getLocaleFromPath("/services")).toBe("fr");
    expect(getLocaleFromPath("/services/01")).toBe("fr");
    expect(getLocaleFromPath("/en")).toBe("en");
    expect(getLocaleFromPath("/en/")).toBe("en");
    expect(getLocaleFromPath("/en/services")).toBe("en");
    expect(getLocaleFromPath("/en/services/01")).toBe("en");
    expect(getLocaleFromPath("/en/contact")).toBe("en");
  });
});

describe("getAlternatePath", () => {
  it("bascule de FR vers EN avec conservation de route exacte", () => {
    expect(getAlternatePath("/", "en")).toBe("/en");
    expect(getAlternatePath("/services", "en")).toBe("/en/services");
    expect(getAlternatePath("/services/01", "en")).toBe("/en/services/01");
    expect(getAlternatePath("/solutions/finance-agent", "en")).toBe("/en/solutions/finance-agent");
    expect(getAlternatePath("/insights/rag-architecture", "en")).toBe("/en/insights/rag-architecture");
    expect(getAlternatePath("/contact", "en")).toBe("/en/contact");
    expect(getAlternatePath("/a-propos", "en")).toBe("/en/a-propos");
  });

  it("bascule de EN vers FR avec suppression exacte du préfixe", () => {
    expect(getAlternatePath("/en", "fr")).toBe("/");
    expect(getAlternatePath("/en/", "fr")).toBe("/");
    expect(getAlternatePath("/en/services", "fr")).toBe("/services");
    expect(getAlternatePath("/en/services/01", "fr")).toBe("/services/01");
    expect(getAlternatePath("/en/solutions/finance-agent", "fr")).toBe("/solutions/finance-agent");
    expect(getAlternatePath("/en/insights/rag-architecture", "fr")).toBe("/insights/rag-architecture");
    expect(getAlternatePath("/en/contact", "fr")).toBe("/contact");
    expect(getAlternatePath("/en/a-propos", "fr")).toBe("/a-propos");
  });

  it("ne modifie pas l'URL si la locale demandée est déjà active", () => {
    expect(getAlternatePath("/services/01", "fr")).toBe("/services/01");
    expect(getAlternatePath("/en/services/01", "en")).toBe("/en/services/01");
  });
});
