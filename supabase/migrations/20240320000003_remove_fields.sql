-- Remover campos não utilizados
ALTER TABLE budgets
DROP COLUMN IF EXISTS total_amount,
DROP COLUMN IF EXISTS company_name; 