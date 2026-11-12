# Photo pipeline

1. `fetch_commons.py` downloads the chosen Wikimedia Commons files (2000px) into `orig/`, and saves author and license details to `credits.json`.
2. `grade.py` crops each photo to 3:2 and applies the site's colour grade: slight desaturation, green-tinted shadows, warm highlights. It writes `out/<key>-800.webp` and `out/<key>-1600.webp`.
3. Copy `out/*.webp` to `public/images/photos/`, and add each photo's credit to `src/lib/photos.ts`.

Requires Python with `pillow` and `numpy` (`python3 -m venv venv && venv/bin/pip install pillow numpy`). Run from a scratch folder, not inside the repo. Keep downloaded originals out of git.
