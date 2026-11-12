// ads.txt: tells ad buyers which ad networks may sell space on this site.
// Generated from ADSENSE_CLIENT so it can't drift out of sync with the ads.
import type { APIRoute } from 'astro';
import { ADSENSE_CLIENT } from '../lib/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = ADSENSE_CLIENT
    ? `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
    : '# bakahan.com does not sell ads through ad networks yet.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
