-- Add client_id foreign key to perdcomps table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.perdcomps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  numero TEXT NOT NULL,
  imposto TEXT NOT NULL,
  competencia TEXT NOT NULL,
  valor_solicitado DECIMAL(15,2) NOT NULL DEFAULT 0,
  valor_recebido DECIMAL(15,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pendente',
  data_transmissao DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.perdcomps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can view perdcomps" 
ON public.perdcomps 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create perdcomps" 
ON public.perdcomps 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update perdcomps" 
ON public.perdcomps 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete perdcomps" 
ON public.perdcomps 
FOR DELETE 
USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_perdcomps_client_id ON public.perdcomps(client_id);

-- Add trigger for updated_at
CREATE TRIGGER update_perdcomps_updated_at
BEFORE UPDATE ON public.perdcomps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample perdcomps data
INSERT INTO public.perdcomps (client_id, numero, imposto, competencia, valor_solicitado, valor_recebido, status, data_transmissao, observacoes)
SELECT 
  c.id,
  'PERDCOMP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 6, '0'),
  CASE (RANDOM() * 3)::INT
    WHEN 0 THEN 'PIS'
    WHEN 1 THEN 'COFINS'
    ELSE 'IRPJ'
  END,
  TO_CHAR(CURRENT_DATE - INTERVAL '1 month' * (RANDOM() * 12)::INT, 'MM/YYYY'),
  ROUND((RANDOM() * 100000 + 10000)::NUMERIC, 2),
  CASE 
    WHEN RANDOM() > 0.5 THEN ROUND((RANDOM() * 50000 + 5000)::NUMERIC, 2)
    ELSE 0
  END,
  CASE (RANDOM() * 4)::INT
    WHEN 0 THEN 'Pendente'
    WHEN 1 THEN 'Em Análise'
    WHEN 2 THEN 'Aprovado'
    ELSE 'Recusado'
  END,
  CURRENT_DATE - INTERVAL '1 day' * (RANDOM() * 30)::INT,
  CASE 
    WHEN RANDOM() > 0.7 THEN 'Aguardando documentação complementar'
    ELSE NULL
  END
FROM public.clients c
CROSS JOIN generate_series(1, 3) AS s(i)
LIMIT 15;