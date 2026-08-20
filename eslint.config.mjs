import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Règle locale : interdit l'import de modules serveur depuis un fichier
 * `"use client"` (défense en profondeur, complément de `server-only`).
 */
const noServerModulesInClientRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Interdit les modules serveur dans les fichiers 'use client'",
    },
  },
  create(context) {
    const source = context.getSourceCode().text;
    const isClient =
      source.startsWith('"use client"') || source.startsWith("'use client'");
    if (!isClient) return {};
    const serverPrefixes = [
      "@/lib/db",
      "@/lib/email",
      "@/lib/observability",
      "@/lib/security",
      "@/lib/services",
    ];
    return {
      ImportDeclaration(node) {
        const src = node.source.value;
        if (
          typeof src === "string" &&
          serverPrefixes.some((p) => src === p || src.startsWith(p + "/"))
        ) {
          context.report({
            node,
            message: `Module serveur interdit dans un composant client: ${src}`,
          });
        }
      },
    };
  },
};

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: {
      local: { rules: { "no-server-modules-in-client": noServerModulesInClientRule } },
    },
    rules: {
      // ===== Sécurité : cloisonnement serveur / client =====
      "local/no-server-modules-in-client": "error",

      // ===== TypeScript =====
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",

      // ===== React & Next.js =====
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "@next/next/no-img-element": "off",

      // ===== JavaScript =====
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-empty": "warn",
      "no-irregular-whitespace": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".next-e2e/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**",
      "examples/**",
      "skills/**",
      ".gemini/**",
    ],
  },
];

export default eslintConfig;
