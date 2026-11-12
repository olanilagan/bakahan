// Scheduled publishing for guides.
// Every guide has a publishDate. Pages that list or show guides are rendered on
// request and hide anything whose date hasn't arrived yet in Philippine time.
// A guide therefore goes live on its morning automatically: no rebuild, no deploy.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/utils';

export type Guide = CollectionEntry<'articles'>;

/** Today's date in the Philippines, as YYYY-MM-DD. */
export function todayManila(now = new Date()): string {
  return new Date(now.getTime() + 8 * 3_600_000).toISOString().slice(0, 10);
}

export function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function isPublished(guide: Guide, today = todayManila()): boolean {
  return dateKey(guide.data.publishDate) <= today;
}

export function slugOf(guide: Guide): string {
  return guide.id.split('/')[1]!;
}

/** Published guides in one language, in reading order (the "order" field). */
export async function publishedGuides(lang: Lang): Promise<Guide[]> {
  const today = todayManila();
  return (await getCollection('articles', (a) => a.id.startsWith(`${lang}/`) && isPublished(a, today))).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

/** Newest first, for "latest guides" lists. */
export async function latestGuides(lang: Lang, limit = 5): Promise<Guide[]> {
  return (await publishedGuides(lang))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime() || a.data.order - b.data.order)
    .slice(0, limit);
}

/** Published within the last 14 days. */
export function isNew(guide: Guide, today = todayManila()): boolean {
  const ageDays = (Date.parse(today) - guide.data.publishDate.getTime()) / 86_400_000;
  return ageDays >= 0 && ageDays < 14;
}

/** Upcoming guides (English titles), for the admin publishing calendar. */
export async function scheduledGuides(): Promise<Guide[]> {
  const today = todayManila();
  return (await getCollection('articles', (a) => a.id.startsWith('en/') && !isPublished(a, today))).sort(
    (a, b) => a.data.publishDate.getTime() - b.data.publishDate.getTime(),
  );
}
