-- Bakahan initial schema.
-- Timestamps are stored as ISO-8601 text in UTC (SQLite has no native date type).

CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  name          TEXT    NOT NULL,
  password_hash TEXT    NOT NULL,           -- "pbkdf2-sha256$<iterations>$<salt b64>$<hash b64>"
  region        TEXT,
  role          TEXT    NOT NULL DEFAULT 'raiser', -- raiser | trader | buyer | student | business | other
  phone         TEXT,
  is_admin      INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

-- Login sessions. We store only a SHA-256 hash of the session token, so a
-- leaked database can't be used to hijack sessions.
CREATE TABLE sessions (
  token_hash  TEXT    PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX idx_sessions_user ON sessions(user_id);

-- Prices reported by members (members-only data).
CREATE TABLE price_reports (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  observed_on   TEXT    NOT NULL,            -- YYYY-MM-DD the price was seen
  kind          TEXT    NOT NULL,            -- liveweight | carcass | retail
  animal_class  TEXT    NOT NULL DEFAULT 'any', -- any | bull | steer | cow | heifer | feeder
  price_per_kg  REAL    NOT NULL,
  region        TEXT    NOT NULL,
  location      TEXT,                        -- town / market name
  notes         TEXT,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX idx_prices_observed ON price_reports(observed_on);
CREATE INDEX idx_prices_kind_region ON price_reports(kind, region);

-- Marketplace: animals for sale, or wanted.
CREATE TABLE listings (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  intent        TEXT    NOT NULL DEFAULT 'sell', -- sell | buy
  animal_type   TEXT    NOT NULL,            -- bull | steer | cow | heifer | calf | feeder | breeder | mixed
  breed         TEXT,
  head_count    INTEGER NOT NULL DEFAULT 1,
  weight_kg     REAL,                        -- approx. per head
  price         REAL,
  price_unit    TEXT    NOT NULL DEFAULT 'negotiable', -- head | kg | negotiable
  title         TEXT    NOT NULL,
  description   TEXT,
  region        TEXT    NOT NULL,
  location      TEXT,
  contact       TEXT    NOT NULL,            -- phone / Messenger; shown to members only
  status        TEXT    NOT NULL DEFAULT 'active', -- active | sold | removed
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  expires_at    TEXT    NOT NULL
);
CREATE INDEX idx_listings_status ON listings(status, created_at);

-- Business directory. New entries wait for admin approval.
CREATE TABLE businesses (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name          TEXT    NOT NULL,
  category      TEXT    NOT NULL,            -- feeds | vet | trader | breeder | equipment | transport | finance | agritech | other
  description   TEXT,
  region        TEXT    NOT NULL,
  location      TEXT,
  phone         TEXT,
  website       TEXT,
  status        TEXT    NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX idx_businesses_status ON businesses(status, category);

-- Waitlist for the farm management software.
CREATE TABLE waitlist (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  name        TEXT,
  herd_size   TEXT,
  farm_type   TEXT,
  region      TEXT,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
