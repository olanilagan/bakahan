-- Messages sent through the website's contact form.
CREATE TABLE contact_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  topic       TEXT    NOT NULL,            -- general | invest | advertise | marketplace
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  phone       TEXT,
  message     TEXT    NOT NULL,
  lang        TEXT    NOT NULL DEFAULT 'en',
  emailed     INTEGER NOT NULL DEFAULT 0,  -- 1 once forwarded to the owner's inbox
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX idx_contact_created ON contact_messages(created_at);
