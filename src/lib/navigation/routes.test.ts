import { describe, expect, it } from "vitest";
import { pathToView, viewToPath } from "./routes";
import type { ViewKey } from "@/types/content";

describe("viewToPath", () => {
  it("mappe les vues statiques vers leurs routes", () => {
    expect(viewToPath("home")).toBe("/");
    expect(viewToPath("services")).toBe("/services");
    expect(viewToPath("solutions")).toBe("/solutions");
    expect(viewToPath("blog")).toBe("/insights");
    expect(viewToPath("contact")).toBe("/contact");
    expect(viewToPath("rgpd")).toBe("/confidentialite");
    expect(viewToPath("legal")).toBe("/mentions-legales");
    expect(viewToPath("about")).toBe("/a-propos");
  });

  it("construit les routes de détail par identifiant", () => {
    expect(viewToPath("service-detail", "01")).toBe("/services/01");
    expect(viewToPath("solution-detail", "logistics-ai")).toBe("/solutions/logistics-ai");
    expect(viewToPath("blog-detail", "rag-evaluation")).toBe("/insights/rag-evaluation");
  });

  it("encode l'identifiant dans l'URL", () => {
    expect(viewToPath("solution-detail", "retail bi")).toBe("/solutions/retail%20bi");
  });

  it("retombe sur une route vide pour un détail sans identifiant", () => {
    expect(viewToPath("solution-detail")).toBe("/solutions/");
    expect(viewToPath("blog-detail")).toBe("/insights/");
  });

  it("retombe sur '/' pour une vue inconnue", () => {
    expect(viewToPath("unknown" as ViewKey)).toBe("/");
  });
});

describe("pathToView", () => {
  it("déduit la vue active depuis le pathname racine", () => {
    expect(pathToView("/")).toBe("home");
    expect(pathToView("/services")).toBe("services");
    expect(pathToView("/services/03")).toBe("services");
    expect(pathToView("/solutions")).toBe("solutions");
    expect(pathToView("/solutions/logistics-ai")).toBe("solutions");
    expect(pathToView("/insights")).toBe("blog");
    expect(pathToView("/insights/rag-evaluation")).toBe("blog");
    expect(pathToView("/contact")).toBe("contact");
    expect(pathToView("/confidentialite")).toBe("rgpd");
    expect(pathToView("/mentions-legales")).toBe("legal");
    expect(pathToView("/a-propos")).toBe("about");
  });

  it("retombe sur home pour un chemin inconnu", () => {
    expect(pathToView("/inexistant")).toBe("home");
    expect(pathToView("")).toBe("home");
  });
});
