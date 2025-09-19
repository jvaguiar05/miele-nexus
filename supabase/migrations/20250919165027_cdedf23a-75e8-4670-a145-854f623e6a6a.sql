-- Create activity_logs table to track user activities
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'client', 'perdcomp', 'report', etc.
  entity_id UUID,
  entity_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own activity logs
CREATE POLICY "Users can view their own activity logs" 
ON public.activity_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own activity logs
CREATE POLICY "Users can create their own activity logs" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to automatically log activities
CREATE OR REPLACE FUNCTION public.log_activity(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_entity_name TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, entity_name, metadata)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_entity_name, p_metadata);
END;
$$;

-- Create triggers to automatically log client activities
CREATE OR REPLACE FUNCTION public.log_client_activity()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_client_changes
AFTER INSERT OR UPDATE OR DELETE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.log_client_activity();

-- Create triggers to automatically log perdcomp activities
CREATE OR REPLACE FUNCTION public.log_perdcomp_activity()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_perdcomp_changes
AFTER INSERT OR UPDATE OR DELETE ON public.perdcomps
FOR EACH ROW
EXECUTE FUNCTION public.log_perdcomp_activity();