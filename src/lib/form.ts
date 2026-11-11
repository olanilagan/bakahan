// Small helpers for reading HTML form posts safely.

/** Trimmed string from a form field, cut to `max` characters. Empty → null. */
export function str(form: FormData, name: string, max = 200): string | null {
  const value = form.get(name);
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed === '' ? null : trimmed;
}

/** Number from a form field within [min, max]. Invalid → null. */
export function num(form: FormData, name: string, min: number, max: number): number | null {
  const raw = str(form, name, 30);
  if (raw === null) return null;
  const value = Number(raw.replace(/[,₱\s]/g, ''));
  return Number.isFinite(value) && value >= min && value <= max ? value : null;
}

export function isEmail(value: string | null): value is string {
  return !!value && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** YYYY-MM-DD for "today" in the Philippines. */
export function todayPH(): string {
  return new Date(Date.now() + 8 * 3_600_000).toISOString().slice(0, 10);
}

export function daysAgoISO(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

/** Make a user-entered website safe to link to (http/https only). */
export function safeUrl(value: string | null): string | null {
  if (!value) return null;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}
