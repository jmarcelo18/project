-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Enable read access for all users" ON budgets;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON budgets;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON budgets;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON budgets;

-- Habilitar RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Criar novas políticas
CREATE POLICY "Enable read access for all users"
ON budgets FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON budgets FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
ON budgets FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
ON budgets FOR DELETE
TO authenticated
USING (true); 