/**
 * Version de l'application — source unique de vérité côté runtime.
 *
 * En production : injecter `NEXT_PUBLIC_APP_VERSION` au build
 * (le script .zscripts/build.sh le propage depuis package.json).
 *
 * En dev direct : on tombe sur la constante ci-dessous (à garder
 * synchronisée avec `version` du package.json).
 */

const FALLBACK_VERSION = "2.4.1";

export const APP_VERSION: string =
  process.env.NEXT_PUBLIC_APP_VERSION ?? FALLBACK_VERSION;
