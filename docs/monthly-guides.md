# Monthly guide batch

At the start of each month the owner asks Claude to "create new articles". This is the process.

1. **Find the gap.** List existing guides (`src/content/articles/en/`): slugs, categories, `order`, `publishDate`. Pick 8 practical topics not yet covered, mixed across categories. Prefer topics farmers actually ask about, and anything seasonal for the coming months, for example the dry season from February to May and typhoons from June to November.
2. **Schedule.** Use 8 consecutive Tuesday/Friday dates, after the latest existing `publishDate` and at least 7 days from today. `order` continues from the highest existing number, and `updated` is the same as `publishDate`.
3. **Research and write.** Use parallel writers, two topics each, in English and Filipino. Give each writer:
   - `docs/style-guide.md`, which they must follow exactly
   - the source rules: read the real pages, prefer Philippine sources (DA, BAI, PCC, PCIC, NMIS, PCA, PCAARRD, ATI, PSA, PAGASA, UPLB, PNA, lawphil), and say when a figure is from abroad
   - the accuracy rules: no invented facts, anecdotes, dosages or vague attributions
4. **Edit for voice.** Do one editing pass across the new batch against the style guide. Pay special attention to the Filipino versions (natural Luzon Tagalog, not translated) and to keeping EN and FIL saying the same facts.
5. **Check.**
   - No em/en dashes or exclamation marks in any body.
   - Every guide ends with `## Summary` / `## Buod`.
   - `npx astro check` reports 0 errors.
   - `npm run build` passes.
6. **Covers.** Optionally map new slugs to existing photos in `GUIDE_COVERS` (`src/lib/photos.ts`).
7. **Ship.** Commit and push to `main`. Workers Builds deploys automatically, and each guide appears on its date with no further action.

A cloud routine for this exists but is disabled. Its environment couldn't open web pages, which made the research too thin. Re-enable it only if the environment gets full network access.
