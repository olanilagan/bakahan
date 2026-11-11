# How bakahan.com works

This document follows a request from a visitor's phone to the database and back, and names the file responsible at each step.

## The big picture

```
 Visitor's browser
       │  1. DNS: "where is bakahan.com?"
       ▼
 Cloudflare DNS ── answers with a Cloudflare edge address (anycast, nearest data centre)
       │  2. HTTPS request (certificate issued and renewed by Cloudflare)
       ▼
 Cloudflare edge (e.g. Manila or Singapore data centre)
       │
       ├─ 3a. Is it a pre-built file? (HTML page, CSS, favicon)
       │       → served straight from Workers Static Assets. No code runs.
       │
       └─ 3b. Otherwise → runs our Worker (the Astro server bundle)
               │  middleware.ts: read session cookie → look up member in D1
               │  page frontmatter: read form / query D1 / build HTML
               ▼
           D1 database (SQLite, managed by Cloudflare)
```

Everything runs on Cloudflare: there is no separate server to rent or patch. The Worker starts in milliseconds in whichever data centre is closest to the visitor.

## The two kinds of pages

Astro lets each page choose when its HTML is produced. This choice is the main architectural decision on every page.

| Kind | When HTML is made | Examples | File marker |
| --- | --- | --- | --- |
| **Pre-rendered (static)** | Once, at build time | Home, guides, farm page | `export const prerender = true` |
| **On-demand (server-rendered)** | On every request, by the Worker | Marketplace, prices, login, account | `export const prerender = false` |

Static pages are the cheapest and fastest. They cost no CPU time, and Cloudflare can cache them anywhere. Pages that depend on the database or on who is logged in must run on demand.

### Server islands: mixing the two

The home page is static, but it shows the latest listings and the header shows the member's name. These parts are **server islands**: small components marked `server:defer`. The browser loads the static page first, then fetches each island separately.

- `src/components/AccountMenu.astro`: "Log in" vs. the member's name
- `src/components/LatestListings.astro`: newest marketplace listings

## Request walk-through: posting a listing

1. The member opens `/fil/market/new/`. Route file: `src/pages/[lang]/market/new.astro`. The `[lang]` folder means "any value here becomes `Astro.params.lang`".
2. `src/middleware.ts` runs first. It reads the `bk_session` cookie, hashes it, and looks the hash up in the `sessions` table. If it finds a match, it sets `Astro.locals.user`.
3. The page checks `Astro.locals.user`. If nobody is logged in, it redirects to `/fil/login/?next=/fil/market/new/`.
4. The page renders a plain HTML `<form method="post">`. No JavaScript is needed, so it works on any phone and on slow data.
5. The member submits, and the browser POSTs the form to the same URL.
6. Astro's built-in **origin check** rejects POSTs that come from another website (CSRF protection).
7. The page reads the form with helpers in `src/lib/form.ts`. These trim each value, cap its length, and accept only known choices from `src/lib/options.ts`.
8. It runs `INSERT INTO listings ...` with **bound parameters** (`?`). User input is never pasted into SQL text, which prevents SQL injection.
9. It redirects to the new listing (`303 See Other`). This is the "POST/redirect/GET" pattern: refreshing the page won't post the listing twice.

## Data model

The schema lives in `migrations/0001_init.sql`.

```
users ─┬─< sessions          (login sessions; only token hashes stored)
       ├─< listings          (marketplace; contact shown to members only)
       ├─< price_reports     (member price data)
       └─< businesses        (directory; status pending → approved by admin)
waitlist                     (farm-app sign-ups, no account needed)
```

Schema changes are made by adding a new numbered file in `migrations/`. Wrangler records which files have been applied, both locally and in production.

## Login and security

| Concern | How it's handled | File |
| --- | --- | --- |
| Storing passwords | PBKDF2-SHA256 with a random salt, 100,000 iterations (the Workers maximum). The iteration count is stored in each hash, so it can be raised later. | `src/lib/auth.ts` |
| Sessions | A 32-byte random token goes in an `HttpOnly; Secure; SameSite=Lax` cookie. Only its SHA-256 hash goes in D1, so a leaked database can't log anyone in. | `src/lib/auth.ts` |
| Password guessing | Cloudflare Rate Limiting binding allows 10 attempts per minute per IP on login and signup. | `wrangler.jsonc`, `allowAttempt()` |
| CSRF | Astro rejects cross-site form POSTs. The SameSite cookie is a second layer. Logout is POST-only. | Astro default, `logout.ts` |
| SQL injection | Bound parameters only | every `env.DB.prepare(...)` |
| XSS | Astro escapes every `{value}` in templates by default. User-supplied website URLs are limited to http/https. | `safeUrl()` |
| Open redirects | `?next=` only accepts paths on this site | `safeNext()` |
| Member-only data | Contacts and price data are checked server-side, not hidden with CSS | `market/[id].astro`, `prices.astro` |

## Two languages

- Every URL starts with the language: `/en/...` or `/fil/...`.
- `bakahan.com/` redirects based on a saved `lang` cookie, then on the browser's `Accept-Language` header. See `src/pages/index.astro`.
- Interface text lives in `src/i18n/ui.ts`. Each guide is two Markdown files with the same name, in `en/` and `fil/`.
- `<link rel="alternate" hreflang>` tags and `sitemap.xml` tell search engines that the two versions are translations of each other.

## Configuration: `wrangler.jsonc`

This file tells Cloudflare what the Worker is connected to. Each entry becomes a property on `env`:

- `assets` → the `dist/` folder of pre-built files
- `d1_databases` → `env.DB`
- `ratelimits` → `env.AUTH_LIMITER`
- `routes` → serve on bakahan.com and www.bakahan.com (Cloudflare creates the DNS records and certificates)

`npx wrangler types` reads this file and generates `worker-configuration.d.ts`, so TypeScript knows what `env.DB` is.

## Free-tier limits that matter

| Limit (free plan) | Our usage |
| --- | --- |
| 100,000 Worker requests/day | Static pages don't count. Each member action is one or two requests. |
| 10 ms CPU per request | Password hashing is the heaviest operation, and it fits. Everything else is mostly waiting on D1, which doesn't count. |
| D1: 5 GB storage, 5M row reads/day | Text-only rows; years of headroom at this scale |
| Email sending | Not available on free. That's why there is no "forgot password" email yet. |
