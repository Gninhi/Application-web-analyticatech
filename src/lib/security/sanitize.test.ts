import { describe, it, expect } from "vitest";
import { sanitizeObject } from "../security/sanitize";

describe("Sanitizer", () => {
  describe("sanitizeObject", () => {
    it("nettoie récursivement les chaînes d'un objet", () => {
      const obj = {
        name: "<script>alert('xss')</script>",
        title: "normal text",
        nested: { inner: "javascript:evil" },
      };
      const result = sanitizeObject(obj);
      expect(result.name).not.toMatch(/<script>/i);
      expect(result.title).toBe("normal text");
      expect(result.nested.inner).not.toMatch(/javascript:/i);
    });

    it("préserve les nombres et objets non-chaînes", () => {
      const obj = { count: 42, active: true, list: [1, 2, 3] };
      const result = sanitizeObject(obj);
      expect(result.count).toBe(42);
      expect(result.active).toBe(true);
      expect(result.list).toEqual([1, 2, 3]);
    });

    it("gère les tableaux de chaînes", () => {
      const result = sanitizeObject({ tags: ["<bad>", "good", "java<script>script"] });
      expect(result.tags[0]).not.toMatch(/<bad>/i);
      expect(result.tags[1]).toBe("good");
      expect(result.tags[2]).not.toMatch(/script>/i);
    });
  });
});