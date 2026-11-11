import { ui, type UIKey } from './ui';

export const LANGS = ['en', 'fil'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

/** Returns a translate function for one language: t('nav.learn'). */
export function useT(lang: Lang) {
  return (key: UIKey): string => {
    const table = ui[lang] as Partial<Record<UIKey, string>>;
    return table[key] ?? ui.en[key];
  };
}

/**
 * Build a link inside the site for a language: href(lang, '/market') → '/fil/market/'.
 * Always ends in '/', matching how static pages are served (avoids an extra redirect).
 */
export function href(lang: Lang, path = '/'): string {
  let clean = path.startsWith('/') ? path : `/${path}`;
  if (!clean.endsWith('/')) clean += '/';
  return `/${lang}${clean}`;
}

/** Same page, other language: '/en/learn/breeds' → '/fil/learn/breeds'. */
export function switchLangPath(pathname: string, to: Lang): string {
  const parts = pathname.split('/');
  if (isLang(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join('/') || `/${to}/`;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'fil' : 'en';
}

/** For pre-rendered pages: build one copy per language. */
export function langStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

/** Pick a language from a saved cookie, then the browser's Accept-Language header. */
export function negotiateLang(cookieLang: string | undefined, acceptLanguage: string | null): Lang {
  if (isLang(cookieLang)) return cookieLang;
  const header = (acceptLanguage ?? '').toLowerCase();
  if (/\b(fil|tl)\b/.test(header)) return 'fil';
  return DEFAULT_LANG;
}

const locales: Record<Lang, string> = { en: 'en-PH', fil: 'fil-PH' };

export function formatDate(lang: Lang, value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleDateString(locales[lang], { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Manila' });
}

export function formatPeso(value: number): string {
  return '₱' + value.toLocaleString('en-PH', { maximumFractionDigits: value < 1000 ? 2 : 0 });
}
