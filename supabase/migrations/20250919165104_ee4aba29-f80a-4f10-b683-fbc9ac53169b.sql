-- Fix security warnings by setting search_path for functions
DROP FUNCTION IF EXISTS public.log_client_activity() CASCADE;
DROP FUNCTION IF EXISTS public.log_perdcomp_activity() CASCADE;

-- Recreate functions with search_path set
CREATE OR REPLACE FUNCTION public.log_client_activity()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      'Cliente cadastrado',
      'client',
      NEW.id,
      NEW.razao_social,
      jsonb_build_object('operation', 'INSERT', 'cnpj', NEW.cnpj)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_activity(
      'Cliente atualizado',
      'client',
      NEW.id,
      NEW.razao_social,
      jsonb_build_object('operation', 'UPDATE', 'cnpj', NEW.cnpj)
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_activity(
      'Cliente removido',
      'client',
      OLD.id,
      OLD.razao_social,
      jsonb_build_object('operation', 'DELETE', 'cnpj', OLD.cnpj)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_perdcomp_activity()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_client_name TEXT;
BEGIN
  -- Get client name for better activity description
  SELECT razao_social INTO v_client_name FROM public.clients WHERE id = COALESCE(NEW.client_id, OLD.client_id);
  
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      'PER/DCOMP criado',
      'perdcomp',
      NEW.id,
      v_client_name,
      jsonb_build_object('operation', 'INSERT', 'competencia', NEW.competencia, 'imposto', NEW.imposto, 'valor', NEW.valor_solicitado)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_activity(
      'PER/DCOMP atualizado',
      'perdcomp',
      NEW.id,
      v_client_name,
      jsonb_build_object('operation', 'UPDATE', 'competencia', NEW.competencia, 'status', NEW.status, 'valor', NEW.valor_solicitado)
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_activity(
      'PER/DCOMP removido',
      'perdcomp',
      OLD.id,
      v_client_name,
      jsonb_build_object('operation', 'DELETE', 'competencia', OLD.competencia)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER log_client_changes
AFTER INSERT OR UPDATE OR DELETE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.log_client_activity();

CREATE TRIGGER log_perdcomp_changes
AFTER INSERT OR UPDATE OR DELETE ON public.perdcomps
FOR EACH ROW
EXECUTE FUNCTION public.log_perdcomp_activity();