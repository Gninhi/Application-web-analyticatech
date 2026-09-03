import { describe, expect, it } from "vitest";
import { KEY_STATS_CONFIG, getKeyStats } from "./stats";

describe("src/data/stats.ts - Source unique de vérité des statistiques clés", () => {
  it("contient les 4 statistiques requises avec des propriétés valides", () => {
    expect(KEY_STATS_CONFIG).toBeDefined();
    expect(KEY_STATS_CONFIG.missions).toBeDefined();
    expect(KEY_STATS_CONFIG.costReduction).toBeDefined();
    expect(KEY_STATS_CONFIG.uptime).toBeDefined();
    expect(KEY_STATS_CONFIG.satisfaction).toBeDefined();

    expect(KEY_STATS_CONFIG.missions.value).toBeTruthy();
    expect(KEY_STATS_CONFIG.missions.labelFr).toBe("Missions livrées");
    expect(KEY_STATS_CONFIG.missions.labelEn).toBe("Deployed Missions");

    expect(KEY_STATS_CONFIG.costReduction.value).toBeTruthy();
    expect(KEY_STATS_CONFIG.costReduction.labelFr).toBe("Coûts réduits");
    expect(KEY_STATS_CONFIG.costReduction.labelEn).toBe("Cost Reduction");

    expect(KEY_STATS_CONFIG.uptime.value).toBeTruthy();
    expect(KEY_STATS_CONFIG.uptime.labelFr).toBe("Uptime plateforme");
    expect(KEY_STATS_CONFIG.uptime.labelEn).toBe("Platform Uptime");

    expect(KEY_STATS_CONFIG.satisfaction.value).toBeTruthy();
    expect(KEY_STATS_CONFIG.satisfaction.labelFr).toBe("Satisfaction C-Level");
    expect(KEY_STATS_CONFIG.satisfaction.labelEn).toBe("C-Level Satisfaction");
  });

  it("getKeyStats('fr') retourne exactement 4 métriques avec libellés français", () => {
    const statsFr = getKeyStats("fr");
    expect(statsFr).toHaveLength(4);

    expect(statsFr[0]).toEqual({
      v: KEY_STATS_CONFIG.missions.value,
      l: KEY_STATS_CONFIG.missions.labelFr,
      key: "missions_delivered",
      numericValue: KEY_STATS_CONFIG.missions.numericValue,
    });

    expect(statsFr[1]).toEqual({
      v: KEY_STATS_CONFIG.costReduction.value,
      l: KEY_STATS_CONFIG.costReduction.labelFr,
      key: "cost_reduction",
      numericValue: KEY_STATS_CONFIG.costReduction.numericValue,
    });

    expect(statsFr[2]).toEqual({
      v: KEY_STATS_CONFIG.uptime.value,
      l: KEY_STATS_CONFIG.uptime.labelFr,
      key: "uptime_platform",
      numericValue: KEY_STATS_CONFIG.uptime.numericValue,
    });

    expect(statsFr[3]).toEqual({
      v: KEY_STATS_CONFIG.satisfaction.value,
      l: KEY_STATS_CONFIG.satisfaction.labelFr,
      key: "satisfaction_rate",
      numericValue: KEY_STATS_CONFIG.satisfaction.numericValue,
    });
  });

  it("getKeyStats('en') retourne exactement 4 métriques avec libellés anglais", () => {
    const statsEn = getKeyStats("en");
    expect(statsEn).toHaveLength(4);

    expect(statsEn[0].l).toBe("Deployed Missions");
    expect(statsEn[1].l).toBe("Cost Reduction");
    expect(statsEn[2].l).toBe("Platform Uptime");
    expect(statsEn[3].l).toBe("C-Level Satisfaction");

    // Les valeurs numériques et formatées restent parfaitement identiques entre FR et EN
    expect(statsEn[0].v).toBe(KEY_STATS_CONFIG.missions.value);
    expect(statsEn[1].v).toBe(KEY_STATS_CONFIG.costReduction.value);
    expect(statsEn[2].v).toBe(KEY_STATS_CONFIG.uptime.value);
    expect(statsEn[3].v).toBe(KEY_STATS_CONFIG.satisfaction.value);
  });
});
