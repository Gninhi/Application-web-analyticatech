import { describe, expect, it } from "vitest";
import { getMetrics } from "./metrics.service";
import { FALLBACK_METRICS_FR, FALLBACK_METRICS_EN } from "@/lib/content/fallbacks";

describe("metrics.service resilience & fallbacks", () => {
  it("retourne les métriques par défaut en FR avec les valeurs réalistes harmonisées", async () => {
    const metrics = await getMetrics("fr");
    expect(metrics).toBeDefined();
    expect(metrics.length).toBe(8);

    const keys = metrics.map((m) => m.key);
    expect(keys).toContain("missions_delivered");
    expect(keys).toContain("cost_reduction");
    expect(keys).toContain("uptime_platform");
    expect(keys).toContain("satisfaction_rate");
    expect(keys).toContain("processes_automated");
    expect(keys).toContain("agents_production");
    expect(keys).toContain("dashboards_decisional");
    expect(keys).toContain("hours_saved_monthly");

    const missions = metrics.find((m) => m.key === "missions_delivered");
    expect(missions?.value).toBe("48+");

    const cost = metrics.find((m) => m.key === "cost_reduction");
    expect(cost?.value).toBe("35%");

    const uptime = metrics.find((m) => m.key === "uptime_platform");
    expect(uptime?.value).toBe("99.9%");

    const satisfaction = metrics.find((m) => m.key === "satisfaction_rate");
    expect(satisfaction?.value).toBe("4.9/5");
  }, 15000);

  it("retourne les métriques en anglais pour la locale EN", async () => {
    const metrics = await getMetrics("en");
    expect(metrics).toBeDefined();
    expect(metrics.length).toBe(8);

    const missions = metrics.find((m) => m.key === "missions_delivered");
    expect(missions?.label).toBe("Deployed Missions");
    expect(missions?.value).toBe("48+");

    const cost = metrics.find((m) => m.key === "cost_reduction");
    expect(cost?.label).toBe("Cost Reduction");
    expect(cost?.value).toBe("35%");
  }, 15000);

  it("FALLBACK_METRICS_FR et EN respectent la plage réaliste demandée (20 à 70)", () => {
    const missions = FALLBACK_METRICS_FR.find((m) => m.key === "missions_delivered");
    expect(missions?.numericValue).toBe(48);

    const processes = FALLBACK_METRICS_FR.find((m) => m.key === "processes_automated");
    expect(processes?.numericValue).toBe(48);

    const agents = FALLBACK_METRICS_FR.find((m) => m.key === "agents_production");
    expect(agents?.numericValue).toBe(38);

    const dashboards = FALLBACK_METRICS_FR.find((m) => m.key === "dashboards_decisional");
    expect(dashboards?.numericValue).toBe(42);

    const enMissions = FALLBACK_METRICS_EN.find((m) => m.key === "missions_delivered");
    expect(enMissions?.numericValue).toBe(48);
  });
});
