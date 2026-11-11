// Runs before every on-demand (server-rendered) request: looks up the logged-in
// user from the session cookie and adds security headers to the response.
import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, getSessionUser } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = null;

  // Pre-rendered pages are built ahead of time and have no visitor yet.
  if (context.isPrerendered) return next();

  const token = context.cookies.get(SESSION_COOKIE)?.value;
  if (token) context.locals.user = await getSessionUser(token);

  const response = await next();
  try {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Frame-Options', 'DENY');
    // Personalised pages must never be stored by shared caches.
    if (context.locals.user) response.headers.set('Cache-Control', 'private, no-store');
  } catch {
    // Some responses (e.g. redirects) have read-only headers; that's fine.
  }
  return response;
});
