// sitemap.xml: tells search engines which public pages exist, in both languages.
// Built on request so guides appear here on their publish date.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { dateKey, isPublished } from '../lib/guides';
import { LANGS } from '../i18n/utils';

export const prerender = false;

const SECTIONS = ['/', '/learn/', '/market/', '/prices/', '/directory/', '/farm/', '/app/', '/contact/', '/credits/', '/about/', '/advertise/', '/privacy/', '/terms/'];

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://bakahan.com')).origin;
  const articles = await getCollection('articles');

  const urls: { loc: string; alternates: Record<string, string>; lastmod?: string }[] = [];
  const add = (path: string, lastmod?: string) => {
    const alternates = Object.fromEntries(LANGS.map((l) => [l, `${base}/${l}${path}`]));
    for (const lang of LANGS) urls.push({ loc: alternates[lang]!, alternates, lastmod });
  };

  SECTIONS.forEach((p) => add(p));
  for (const a of articles.filter((a) => a.id.startsWith('en/') && isPublished(a))) {
    add(`/learn/${a.id.split('/')[1]}/`, dateKey(a.data.updated));
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
${Object.entries(u.alternates)
  .map(([l, href]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`)
  .join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
};
