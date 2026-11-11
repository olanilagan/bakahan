# Design decisions

A short record of the choices made while building bakahan.com, what the alternatives were, and why. Newest at the bottom.

### 1. Cloudflare Workers, not Cloudflare Pages
Cloudflare now points new projects at Workers with Static Assets. Pages is in maintenance mode for new apps. Workers gives one place for static files and server code, plus direct access to D1, KV, R2 and the rest.

### 2. Astro as the framework
Alternatives: Next.js, SvelteKit, plain HTML + a Hono API.

Astro is built for content-heavy sites and sends almost no JavaScript by default, which matters for farmers on prepaid mobile data. It can pre-render the guides and server-render the member pages in the same project. Markdown guides are validated against a schema at build time (`src/content.config.ts`).

### 3. Plain HTML forms, no client-side app
Every form posts back to its own page and works with JavaScript turned off. This means:
- less code
- nothing for a slow connection to break halfway
- built-in browser features (validation, autofill, the back button) keep working

The trade-off is a full page reload on submit. That's acceptable here.

### 4. Language in the URL (`/en/`, `/fil/`)
Alternatives: a cookie-only toggle, or the same URL serving both languages.

URL prefixes make each language its own page. Each can be shared in Messenger, bookmarked, cached, and indexed by search engines separately. The cookie only decides where `bakahan.com/` sends you.

### 5. Our own login instead of a login service
Alternatives: Cloudflare Access (free for 50 users, but meant for staff, not public sign-ups), Auth0/Clerk (third-party dependency, limits on free plans), or "log in with Facebook" (common in the Philippines, but needs a Meta app review).

Email and password with sessions in D1 has no outside dependencies. It also shows clearly how login actually works.

Known gap: password reset needs email, which is a paid Workers feature. Until then, an admin resets passwords by hand.

### 6. Sessions in D1, not Astro's KV sessions
KV is "eventually consistent": a logout can take up to 60 seconds to reach other regions. D1 is consistent, already in use, and lets us delete all of a user's sessions with one query.

### 7. Members-only contact details and price data
Hiding seller phone numbers from logged-out visitors reduces scraping and spam, and gives people a reason to join. Price data is the main membership benefit, so it's checked on the server, not just hidden in the page.

### 8. Directory entries need approval; listings don't
Listings expire after 60 days and are low-stakes. A directory entry looks like an endorsement, so an admin approves each one.

### 9. No photos on listings (yet)
Photos need R2 object storage. R2's free tier is generous, but enabling it requires a payment method on the Cloudflare account. This is deferred until the owner decides; the schema will get a `listing_photos` table in a new migration.

### 10. Light theme only, system-like fonts, no emoji icons
The site is used outdoors on phones, so it uses a high-contrast light theme. After the first version, the owner found the design looked machine-generated: emoji icons, numbered badges, slogan-style headings. Version 0.2 follows agriculture news and agency sites instead, with plain headings, text labels, lists separated by rules, and real content on the home page.

### 11. Weight estimation from photos: planned, not built
This will likely use Workers AI. It needs photos (R2) first, and a dataset of real weighed animals to check its accuracy before farmers rely on it.
