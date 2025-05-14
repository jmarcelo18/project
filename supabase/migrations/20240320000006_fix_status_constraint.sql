-- Remover a constraint existente
ALTER TABLE budgets
DROP CONSTRAINT IF EXISTS budgets_status_check;

-- Adicionar a nova constraint com os valores corretos
ALTER TABLE budgets
ADD CONSTRAINT budgets_status_check
CHECK (status IN ('aguardando_aprovacao', 'orcamento_incompleto', 'aprovado', 'rejeitado'));

-- Atualizar os valores existentes para garantir que estão dentro da constraint
UPDATE budgets
SET status = CASE
    WHEN status = 'pending' THEN 'aguardando_aprovacao'
    WHEN status = 'approved' THEN 'aprovado'
    WHEN status = 'rejected' THEN 'rejeitado'
    WHEN status = 'incomplete' THEN 'orcamento_incompleto'
    ELSE status
END
WHERE status NOT IN ('aguardando_aprovacao', 'orcamento_incompleto', 'aprovado', 'rejeitado'); 