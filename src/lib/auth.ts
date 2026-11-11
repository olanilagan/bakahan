// Authentication: password hashing and login sessions, using only the Web
// Crypto API built into Cloudflare Workers (no extra libraries).
import { env } from 'cloudflare:workers';
import type { AstroCookies } from 'astro';

export const SESSION_COOKIE = 'bk_session';
const SESSION_DAYS = 30;

// Workers caps PBKDF2 at 100,000 iterations. The count is stored inside each
// hash, so it can be raised later without breaking existing passwords.
const PBKDF2_ITERATIONS = 100_000;

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  region: string | null;
  phone: string | null;
  isAdmin: boolean;
  createdAt: string;
}

const enc = new TextEncoder();

function toB64(bytes: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}
function fromB64(text: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
}
function toB64Url(bytes: Uint8Array): string {
  return toB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2-sha256$${PBKDF2_ITERATIONS}$${toB64(salt)}$${toB64(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iter, saltB64, hashB64] = stored.split('$');
  if (scheme !== 'pbkdf2-sha256' || !iter || !saltB64 || !hashB64) return false;
  const expected = fromB64(hashB64);
  const actual = new Uint8Array(await pbkdf2(password, fromB64(saltB64), Number(iter)));
  if (actual.byteLength !== expected.byteLength) return false;
  // Constant-time compare, so response timing doesn't leak how many bytes matched.
  // timingSafeEqual is a Workers extension to Web Crypto, missing from the standard DOM types.
  const subtle = crypto.subtle as SubtleCrypto & { timingSafeEqual(a: ArrayBufferView, b: ArrayBufferView): boolean };
  return subtle.timingSafeEqual(actual, expected);
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Create a session row and set the cookie. The cookie holds a random token; the DB holds only its hash. */
export async function startSession(cookies: AstroCookies, userId: number): Promise<void> {
  const token = toB64Url(crypto.getRandomValues(new Uint8Array(32)));
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await env.DB.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(await sha256Hex(token), userId, expires.toISOString())
    .run();
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true, // JavaScript in the page can't read it
    secure: true, // only sent over HTTPS
    sameSite: 'lax', // not sent on cross-site POSTs (helps stop CSRF)
    expires,
  });
}

export async function getSessionUser(token: string): Promise<SessionUser | null> {
  const row = await env.DB.prepare(
    `SELECT u.id, u.name, u.email, u.region, u.phone, u.is_admin, u.created_at
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > ?`,
  )
    .bind(await sha256Hex(token), new Date().toISOString())
    .first<{ id: number; name: string; email: string; region: string | null; phone: string | null; is_admin: number; created_at: string }>();
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    region: row.region,
    phone: row.phone,
    isAdmin: row.is_admin === 1,
    createdAt: row.created_at,
  };
}

export async function endSession(cookies: AstroCookies): Promise<void> {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256Hex(token)).run();
  }
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

/** Rate-limit by client IP + action. Returns false when the caller should be refused. */
export async function allowAttempt(request: Request, action: string): Promise<boolean> {
  const ip = request.headers.get('cf-connecting-ip') ?? 'local';
  try {
    const { success } = await env.AUTH_LIMITER.limit({ key: `${action}:${ip}` });
    return success;
  } catch {
    return true; // never lock everyone out because the limiter itself failed
  }
}

/** Only allow redirects to paths on this site (prevents "open redirect" tricks). */
export function safeNext(next: string | null | undefined, fallback: string): string {
  if (next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')) return next;
  return fallback;
}
