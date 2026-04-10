CREATE TABLE routes (
  id UUID PRIMARY KEY,
  route_id TEXT UNIQUE NOT NULL,
  ship_id TEXT NOT NULL,
  vessel_type TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  year INT NOT NULL,
  ghg_intensity NUMERIC NOT NULL,
  fuel_consumption NUMERIC NOT NULL,
  distance NUMERIC NOT NULL,
  total_emissions NUMERIC NOT NULL,
  is_baseline BOOLEAN DEFAULT FALSE
);

CREATE TABLE ship_compliance (
  id UUID PRIMARY KEY,
  ship_id TEXT NOT NULL,
  year INT NOT NULL,
  cb_gco2eq NUMERIC NOT NULL
);

CREATE TABLE bank_entries (
  id UUID PRIMARY KEY,
  ship_id TEXT NOT NULL,
  year INT NOT NULL,
  amount_gco2eq NUMERIC NOT NULL
);

CREATE TABLE pools (
  id UUID PRIMARY KEY,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pool_members (
  pool_id UUID REFERENCES pools(id),
  ship_id TEXT NOT NULL,
  cb_before NUMERIC NOT NULL,
  cb_after NUMERIC NOT NULL
);
