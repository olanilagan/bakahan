# Bakahan

Source for [bakahan.com](https://bakahan.com): guides, a cattle marketplace, member price reports and a business directory for cattle raisers in the Philippines. English and Filipino.

Built with [Astro](https://astro.build) and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/), using only Cloudflare's free tier.

- How it works: [docs/architecture.md](docs/architecture.md)
- Why it was built this way: [docs/decisions.md](docs/decisions.md)

## Run it locally

Requires Node 22+.

```bash
npm install
npm run db:migrate:local      # create the local SQLite copy of the database
npm run build
npx wrangler dev              # serves the built site at http://localhost:8787
```

`npm run dev` (Astro's dev server) also works and reloads on save, but it is slow on a Windows drive under WSL.

## Deploy

Pushing to `main` deploys automatically (Cloudflare Workers Builds): it builds, applies database migrations, then deploys. A failed migration stops the deploy.

To deploy from your own machine instead:

```bash
npx wrangler login            # once
npm run deploy                # build, apply DB migrations, upload
```

## Common tasks

| Task | Where |
| --- | --- |
| Edit or add a guide | `src/content/articles/en/<slug>.md` and the same slug in `fil/` |
| Change interface text | `src/i18n/ui.ts` (both languages side by side) |
| Change colours and fonts | `src/styles/global.css` (tokens at the top) |
| Change the database | Add a new file in `migrations/`, then `npm run db:migrate:remote` |
| Make someone an admin | `npx wrangler d1 execute bakahan-db --remote --command "UPDATE users SET is_admin=1 WHERE email='…'"` |
| Reset a member's password | Not built yet. Admin-side reset is on the to-do list. |
