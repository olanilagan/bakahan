// POST-only endpoint: logging out changes state, so it must not be a plain link
// (otherwise any page could log you out with an <img src="/logout">).
import type { APIRoute } from 'astro';
import { endSession } from '../../lib/auth';
import { href, isLang } from '../../i18n/utils';

export const prerender = false;

export const POST: APIRoute = async ({ params, cookies, redirect }) => {
  await endSession(cookies);
  return redirect(href(isLang(params.lang) ? params.lang : 'en', '/'), 303);
};
