/*
  # Initial schema setup for Alta Vista system

  1. Authentication
    - Using Supabase built-in auth

  2. Tables
    - companies
    - service_calls
    - visits
    - avcb_services

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area text NOT NULL,
  periodicity text NOT NULL,
  company text NOT NULL,
  observation text,
  last_maintenance date NOT NULL,
  next_maintenance date NOT NULL,
  technical_responsible text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service calls table
CREATE TABLE IF NOT EXISTS service_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opening_date date NOT NULL,
  protocol text NOT NULL,
  area text NOT NULL,
  problem text NOT NULL,
  status text NOT NULL CHECK (status IN ('Resolvido', 'Pendente', 'Análise')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Visits table
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time time NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  responsible text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AVCB services table
CREATE TABLE IF NOT EXISTS avcb_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  periodicity text NOT NULL CHECK (periodicity IN ('Mensal', 'Trimestral', 'Semestral', 'Anual')),
  last_maintenance date NOT NULL,
  next_maintenance date NOT NULL,
  days_to_expire integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE avcb_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read for authenticated users" ON companies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON companies
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON companies
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON companies
  FOR DELETE TO authenticated USING (true);

-- Repeat policies for other tables
CREATE POLICY "Enable read for authenticated users" ON service_calls
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON service_calls
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON service_calls
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON service_calls
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read for authenticated users" ON visits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON visits
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON visits
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON visits
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read for authenticated users" ON avcb_services
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON avcb_services
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON avcb_services
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON avcb_services
  FOR DELETE TO authenticated USING (true);