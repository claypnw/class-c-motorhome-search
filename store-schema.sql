-- Class C motorhome report store — Cloudflare D1 schema.
-- Same shape as rv_store.py (SQLite). One row per motorhome.
CREATE TABLE IF NOT EXISTS listings (
  num INTEGER PRIMARY KEY,
  title TEXT, price_text TEXT, price_num INTEGER, year INTEGER,
  town TEXT, distance_miles INTEGER, seller_type TEXT, listing_url TEXT,
  section TEXT,            -- payson | near | far | gone  (place / no-longer-listed state)
  choice TEXT DEFAULT 'none',  -- none | interested | not_interested
  first_seen TEXT, last_seen TEXT
);
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
