-- =========================
-- Events table definition
-- =========================

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,

  event_status VARCHAR(20) NOT NULL CHECK (event_status IN ('upcoming','past')),
  category TEXT NOT NULL,

  event_price NUMERIC(10,2) NOT NULL CHECK (event_price >= 0),
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,

  venue TEXT NOT NULL,

  hosted_by JSONB NOT NULL,
    -- e.g. { "name": "...", "email": "...", "contact": "...", ... }

  event_timeline JSONB NOT NULL,
    -- e.g. [ { "time": "2025-07-01T09:00Z", "title": "...", "desc": "..." }, ... ]

  image_gallery JSONB NOT NULL,
    -- e.g. [ {"alt": "...", "img": "<base64string>"}, ... ]

  about_the_host JSONB,
    -- e.g. { "bio": "...", "social": { "twitter": "...", ... } }

  event_highlights JSONB NOT NULL,
    -- e.g. [ "Highlight 1", "Highlight 2", ... ]

  important_info JSONB NOT NULL,
    -- e.g. [ "Info bullet 1", "Info bullet 2", ... ]

  ticket_pricing_list JSONB NOT NULL,
    -- e.g. [
    --   { "tier": "basic",   "price": 50.00, "description": "..." },
    --   { "tier": "premium", "price": 100.00, "limits": {...} },
    --   { "tier": "vip",     "price": 200.00, ... }
    -- ]

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ====================
-- Helpful Indexes
-- ====================

-- For quick lookups by slug
CREATE UNIQUE INDEX idx_events_slug ON events (slug);

-- For filtering upcoming vs past
CREATE INDEX idx_events_status_date ON events (event_status, event_date DESC);
