import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (later classes win on conflicting utilities). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Serializes a params object into a `?a=1&b=2` query string, skipping
 * undefined/empty values. Used by list-style repository methods
 * (`ListQueryParams` -> `/members?page=1&search=jordan`) so every feature
 * builds query strings the same way instead of hand-concatenating.
 */
export function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}
