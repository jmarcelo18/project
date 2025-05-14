-- Adicionar novos campos à tabela budgets
ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS minimum_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Atualizar os valores de status existentes
UPDATE budgets
SET status = CASE
    WHEN status = 'pending' THEN 'aguardando_aprovacao'
    WHEN status = 'approved' THEN 'aprovado'
    WHEN status = 'rejected' THEN 'rejeitado'
    ELSE status
END;

-- Adicionar constraint para os novos valores de status
ALTER TABLE budgets
DROP CONSTRAINT IF EXISTS budgets_status_check;

ALTER TABLE budgets
ADD CONSTRAINT budgets_status_check
CHECK (status IN ('aguardando_aprovacao', 'orcamento_incompleto', 'aprovado', 'rejeitado')); 