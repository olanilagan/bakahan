// Shared helpers for server-rendered pages.
import type { AstroGlobal } from 'astro';
import { href, isLang, type Lang } from '../i18n/utils';

/** Validate the [lang] URL segment. */
export function pageLang(Astro: AstroGlobal): Lang | null {
  const lang = Astro.params.lang;
  return isLang(lang) ? lang : null;
}

/** URL of the login page that returns here afterwards. */
export function loginUrl(lang: Lang, Astro: AstroGlobal): string {
  return `${href(lang, '/login')}?next=${encodeURIComponent(Astro.url.pathname + Astro.url.search)}`;
}

/** Plain bilingual 404 response for server-rendered pages. */
export function notFound(): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · Bakahan</title><link rel="icon" href="/favicon.svg"><style>body{font-family:system-ui,sans-serif;background:#fbf8f0;color:#1c2b21;display:grid;place-items:center;min-height:90vh;margin:0;padding:16px;text-align:center}a{color:#22603a;font-weight:700}</style></head><body><div><h1>Page not found / Hindi makita ang pahina</h1><p><a href="/">Back to home / Bumalik sa home</a></p></div></body></html>`;
  return new Response(html, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
}
