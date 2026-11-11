// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://bakahan.com',
  // Pages are pre-rendered (static) by default. Pages that need a logged-in
  // user or live data opt out with `export const prerender = false`.
  output: 'static',
  adapter: cloudflare({
    // We don't use Astro's image pipeline at runtime, so skip the Images binding.
    imageService: 'passthrough',
  }),
  // We keep our own login sessions in D1 (see src/lib/auth.ts), so turn off
  // Astro's KV-backed sessions; otherwise a KV namespace gets provisioned.
  session: false,
  trailingSlash: 'ignore',
});
