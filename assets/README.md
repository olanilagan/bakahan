# Drop folder for photos and brand files

Put original files here. Nothing in `incoming/` is committed to git or published as-is.

- `incoming/farm/`: the farm, pens, forage, construction progress, people at work
- `incoming/cattle/`: your animals
- `incoming/other/`: anything else (markets, events, documents for reference)
- `brand/`: the logo. Best is SVG, or a large PNG (at least 1000px) with a transparent background. Include colour versions if you have them.

Before anything goes on the website, Claude:
1. removes hidden metadata, including GPS location,
2. resizes and compresses it for phones,
3. colour-matches it to the site, unless you say not to.

Only the processed copies in `public/images/` get published.
