export const DENOM = 20;

export const MAX_SINGLE_TX = 5000;

/**
 * Parse a money-like input into a Number rounded to `decimals`.
 * Accepts strings like "12", "12.3", "12.345", "$1,234.56".
 */
export function parseMoney(input, decimals = 2) {
  if (input == null) return NaN;
  const s = String(input).replace(/[^0-9.]/g, "");
  if (s === "") return NaN;
  const n = Number(s);
  if (!Number.isFinite(n)) return NaN;
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

/**
 * Format a number to fixed decimals (defaults to 2).
 */
export function formatMoney(n, decimals = 2) {
  if (!Number.isFinite(n)) return (0).toFixed(decimals);
  const factor = 10 ** decimals;
  return (Math.round(n * factor) / factor).toFixed(decimals);
}

/**
 * Convert dollars → minor units (cents by default).
 * toMinor(1) === 100, toMinor(12.34) === 1234
 */
export function toMinor(amount, decimals = 2) {
  const n =
    typeof amount === "string" ? parseMoney(amount, decimals) : Number(amount);
  if (!Number.isFinite(n)) return NaN;
  return Math.round(n * 10 ** decimals);
}

/**
 * Convert minor units (cents by default) → dollars.
 */
export function fromMinor(minor, decimals = 2) {
  const m = Number(minor);
  if (!Number.isFinite(m)) return NaN;
  return Math.round(m) / 10 ** decimals;
}

/**
 * Lenient typing normalizer for money inputs:
 * - keeps only digits and a single dot
 * - caps fractional length to `decimals`
 */
export function normalizeTyping(value, decimals = 2) {
  const s = String(value).replace(/[^0-9.]/g, "");
  const [int = "", rawFrac = ""] = s.split(".");
  const frac = s.includes(".") ? rawFrac.slice(0, decimals) : "";
  return s.includes(".") ? `${int}.${frac}` : int;
}
