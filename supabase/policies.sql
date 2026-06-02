-- ============================================================
-- Policies para a tabela mvp_kills
-- Execute no Supabase: SQL Editor > New Query
-- ============================================================

-- 1. LEITURA PÚblica: qualquer pessoa (logada ou não) pode ler
CREATE POLICY "Leitura pública de kills"
ON public.mvp_kills
FOR SELECT
USING (true);

-- 2. INSERÇÃO: apenas usuários autenticados podem registrar kills
CREATE POLICY "Apenas autenticados inserem kills"
ON public.mvp_kills
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 3. Garante que RLS está ativo na tabela
ALTER TABLE public.mvp_kills ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Se já existir alguma policy antiga bloqueando, remova antes:
-- DROP POLICY IF EXISTS "<nome da policy antiga>" ON public.mvp_kills;
-- ============================================================
