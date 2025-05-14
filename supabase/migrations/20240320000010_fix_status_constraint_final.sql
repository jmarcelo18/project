-- Primeiro, vamos verificar os valores atuais
SELECT DISTINCT status FROM budgets;

-- Remover a constraint existente
ALTER TABLE budgets
DROP CONSTRAINT IF EXISTS budgets_status_check;

-- Garantir que todos os valores existentes estejam corretos
UPDATE budgets
SET status = 'aguardando_aprovacao'
WHERE status IS NULL OR status NOT IN ('aguardando_aprovacao', 'orcamento_incompleto', 'aprovado', 'rejeitado');

-- Adicionar a nova constraint
ALTER TABLE budgets
ADD CONSTRAINT budgets_status_check
CHECK (status IN ('aguardando_aprovacao', 'orcamento_incompleto', 'aprovado', 'rejeitado'));

-- Garantir que a coluna status não pode ser nula
ALTER TABLE budgets
ALTER COLUMN status SET NOT NULL,
ALTER COLUMN status SET DEFAULT 'aguardando_aprovacao';

-- Verificar se a constraint foi aplicada corretamente
SELECT DISTINCT status FROM budgets; 