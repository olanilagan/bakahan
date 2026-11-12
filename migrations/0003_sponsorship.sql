-- Paid placements sold directly to businesses.

-- Featured directory entries are listed first and labelled "Featured" until this date.
ALTER TABLE businesses ADD COLUMN featured_until TEXT;

-- "Sponsored by" messages shown on guides, the marketplace and the home page.
CREATE TABLE sponsors (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,             -- business name shown on the site
  url         TEXT,                         -- link (website or Facebook page)
  message_en  TEXT    NOT NULL,             -- one short sentence
  message_fil TEXT,                         -- Filipino version (falls back to English)
  placement   TEXT    NOT NULL DEFAULT 'all', -- all | home | guides | market
  starts_on   TEXT    NOT NULL,             -- YYYY-MM-DD
  ends_on     TEXT    NOT NULL,             -- YYYY-MM-DD (inclusive)
  active      INTEGER NOT NULL DEFAULT 1,
  notes       TEXT,                         -- private: price paid, contact person, etc.
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX idx_sponsors_live ON sponsors(active, placement, ends_on);
