-- Migration: Create lookup tables for normalized metadata
-- Created: 2025-12-11
-- Description: Tạo các bảng lookup để normalize provider, OS, virtualization, và region data
--              với support cho aliases và icon URLs
-- Usage: Copy và paste vào Neon Console SQL Editor cho branch 'development'

-- Lookup tables for normalized metadata
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  website text,
  logo_url text,
  country_code text,
  type text, -- 'cloud', 'vps', 'bare-metal', etc.
  tags jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_aliases (
  alias text PRIMARY KEY,
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS oses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL, -- 'Ubuntu', 'Debian', etc.
  version text, -- '24.04', '12', etc.
  family text, -- 'debian', 'redhat', 'bsd', etc.
  icon_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS os_aliases (
  alias text PRIMARY KEY,
  os_id uuid REFERENCES oses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS virtualizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  icon_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  country_code text, -- ISO 3166-1 alpha-2
  city text,
  region text, -- State/province
  latitude double precision,
  longitude double precision,
  icon_url text, -- Flag icon URL
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add region_id to benchmark_runs (nếu table tồn tại)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'benchmark_runs') THEN
    ALTER TABLE benchmark_runs
      ADD COLUMN IF NOT EXISTS region_id uuid REFERENCES regions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_provider_aliases_provider_id ON provider_aliases(provider_id);
CREATE INDEX IF NOT EXISTS idx_os_aliases_os_id ON os_aliases(os_id);

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'benchmark_runs') THEN
    CREATE INDEX IF NOT EXISTS idx_benchmark_runs_region_id ON benchmark_runs(region_id);
  END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE providers IS 'Lookup table cho VPS/Cloud providers với metadata và logo';
COMMENT ON TABLE provider_aliases IS 'Mapping từ legal names/variations sang provider chuẩn';
COMMENT ON TABLE oses IS 'Lookup table cho operating systems với metadata và icon';
COMMENT ON TABLE os_aliases IS 'Mapping từ OS name variations sang OS chuẩn';
COMMENT ON TABLE virtualizations IS 'Lookup table cho virtualization types';
COMMENT ON TABLE regions IS 'Lookup table cho regions/locations với geo coordinates';
