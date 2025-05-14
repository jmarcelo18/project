-- Primeiro, vamos verificar os valores atuais
SELECT DISTINCT status FROM budgets;

-- Remover a constraint existente
ALTER TABLE budgets
DROP CONSTRAINT IF EXISTS budgets_status_check;

-- Criar um tipo enum para os status
DO $$ BEGIN
    CREATE TYPE budget_status AS ENUM ('aguardando_aprovacao', 'orcamento_incompleto', 'aprovado', 'rejeitado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Converter a coluna status para o tipo enum
ALTER TABLE budgets
ALTER COLUMN status TYPE budget_status
USING CASE
    WHEN status = 'pending' THEN 'aguardando_aprovacao'::budget_status
    WHEN status = 'approved' THEN 'aprovado'::budget_status
    WHEN status = 'rejected' THEN 'rejeitado'::budget_status
    WHEN status = 'incomplete' THEN 'orcamento_incompleto'::budget_status
    ELSE 'aguardando_aprovacao'::budget_status
END;

-- Garantir que a coluna status não pode ser nula
ALTER TABLE budgets
ALTER COLUMN status SET NOT NULL,
ALTER COLUMN status SET DEFAULT 'aguardando_aprovacao'::budget_status;

-- Verificar se a conversão foi bem sucedida
SELECT DISTINCT status FROM budgets; 