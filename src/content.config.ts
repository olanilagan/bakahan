// Content collections: Markdown files validated against a schema at build time.
// Articles live in src/content/articles/<lang>/<slug>.md — same slug in both languages.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['basics', 'breeds', 'fattening', 'feeding', 'health', 'business', 'market']),
    order: z.number(),
    // The guide stays hidden until this date (Philippine time). See src/lib/guides.ts.
    publishDate: z.coerce.date(),
    updated: z.coerce.date(),
    readingMinutes: z.number().optional(),
    sources: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
  }),
});

export const collections = { articles };
