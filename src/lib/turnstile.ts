// Cloudflare Turnstile: server-side check of the token the widget puts in the form.
// Browser → our Worker → Cloudflare siteverify. The secret never reaches the browser.
import { env } from 'cloudflare:workers';

export type TurnstileAction = 'signup' | 'contact' | 'waitlist';

/** True only if Cloudflare confirms the token is valid, for this form, on our own domain. */
export async function verifyTurnstile(form: FormData, request: Request, action: TurnstileAction): Promise<boolean> {
  const token = form.get('cf-turnstile-response');
  const expectedHostnames = new Set(
    (env.TURNSTILE_HOSTNAMES ?? '')
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean),
  );
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048 || expectedHostnames.size === 0) {
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get('cf-connecting-ip') ?? '',
      }),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
      metadata?: { result_with_testing_key?: boolean };
    };
    // Cloudflare's local-development test keys return no action, so skip that
    // one check for them. The real production secret never returns this flag.
    const actionOk = result.action === action || result.metadata?.result_with_testing_key === true;
    // Tokens are single-use and tied to one form (action) and one site (hostname).
    return result.success === true && actionOk && expectedHostnames.has(result.hostname ?? '');
  } catch {
    return false; // network error or bad response: fail closed
  }
}
