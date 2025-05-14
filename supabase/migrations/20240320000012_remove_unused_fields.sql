-- Remover os campos não utilizados
ALTER TABLE budgets
DROP COLUMN IF EXISTS minimum_amount,
DROP COLUMN IF EXISTS status;

-- Remover o tipo enum se não estiver sendo usado em outras tabelas
DROP TYPE IF EXISTS budget_status; 