/** « 11 min » → « 11 min de lecture » (ou « 11 min read ») ; une valeur déjà complète est gardée telle quelle. */
export function formatReadingTime(readingTime: string, suffix: string): string {
  if (readingTime.includes("lecture") || readingTime.includes("read")) return readingTime;
  return `${readingTime.replace(/\s*min.*/i, "")} ${suffix}`;
}
