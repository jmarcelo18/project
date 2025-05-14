-- Primeiro, vamos verificar os valores atuais
SELECT DISTINCT status FROM budgets;

-- Remover a constraint existente
ALTER TABLE budgets
DROP CONSTRAINT IF EXISTS budgets_status_check;

-- Garantir que todos os valores existentes estejam corretos
UPDATE budgets
SET status = 'aguardando_aprovacao'
WHERE status IS NULL OR status NOT IN ('aguardando_aprovacao', 'orcamento_incompleto', 'aprovado', 'rejeitado');

-- Criar um tipo enum para os status
DO $$ BEGIN
    CREATE TYPE budget_status AS ENUM ('aguardando_aprovacao', 'orcamento_incompleto', 'aprovado', 'rejeitado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Converter a coluna status para o tipo enum
ALTER TABLE budgets
ALTER COLUMN status TYPE budget_status
USING status::budget_status;

-- Garantir que a coluna status não pode ser nula
ALTER TABLE budgets
ALTER COLUMN status SET NOT NULL,
ALTER COLUMN status SET DEFAULT 'aguardando_aprovacao'::budget_status; 