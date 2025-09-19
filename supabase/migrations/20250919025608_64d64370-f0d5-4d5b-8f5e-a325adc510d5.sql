-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT NOT NULL,
  tipo_empresa TEXT NOT NULL DEFAULT 'Ltda',
  quadro_societario TEXT,
  cargo TEXT,
  telefone_contato TEXT,
  email_contato TEXT,
  responsavel_financeiro TEXT,
  telefone_comercial TEXT,
  email_comercial TEXT,
  site TEXT,
  cnae TEXT,
  regime_tributario TEXT DEFAULT 'Simples Nacional',
  recuperacao_judicial BOOLEAN DEFAULT false,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  municipio TEXT,
  uf TEXT,
  cep TEXT,
  atividades TEXT,
  anotacoes_anteriores TEXT,
  nova_anotacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to view clients
CREATE POLICY "Authenticated users can view clients" 
ON public.clients 
FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to create clients
CREATE POLICY "Authenticated users can create clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow authenticated users to update clients
CREATE POLICY "Authenticated users can update clients" 
ON public.clients 
FOR UPDATE 
USING (true);

-- Create policy to allow authenticated users to delete clients
CREATE POLICY "Authenticated users can delete clients" 
ON public.clients 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.clients (cnpj, razao_social, nome_fantasia, tipo_empresa, telefone_contato, email_contato, responsavel_financeiro, telefone_comercial, email_comercial, site, cnae, regime_tributario, logradouro, numero, bairro, municipio, uf, cep) VALUES
('11.222.333/0001-44', 'Tech Solutions Ltda', 'TechSol', 'Ltda', '(11) 3456-7890', 'contato@techsol.com.br', 'João Silva', '(11) 3456-7891', 'comercial@techsol.com.br', 'www.techsol.com.br', '62.01-5-00', 'Simples Nacional', 'Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310-100'),
('22.333.444/0001-55', 'Comércio Digital SA', 'DigiCommerce', 'SA', '(21) 2345-6789', 'contato@digicommerce.com.br', 'Maria Santos', '(21) 2345-6790', 'vendas@digicommerce.com.br', 'www.digicommerce.com.br', '47.89-0-01', 'Lucro Real', 'Rua do Comércio', '500', 'Centro', 'Rio de Janeiro', 'RJ', '20010-120'),
('33.444.555/0001-66', 'Indústria Metalúrgica Brasileira Ltda', 'MetalBrasil', 'Ltda', '(31) 3234-5678', 'contato@metalbrasil.com.br', 'Pedro Oliveira', '(31) 3234-5679', 'vendas@metalbrasil.com.br', 'www.metalbrasil.com.br', '24.51-2-00', 'Lucro Presumido', 'Rua Industrial', '750', 'Distrito Industrial', 'Belo Horizonte', 'MG', '31270-800'),
('44.555.666/0001-77', 'Consultoria Empresarial Master MEI', 'Master Consult', 'MEI', '(41) 4123-4567', 'contato@masterconsult.com.br', 'Ana Costa', '(41) 4123-4568', 'projetos@masterconsult.com.br', 'www.masterconsult.com.br', '70.20-4-00', 'MEI', 'Rua das Flores', '123', 'Centro', 'Curitiba', 'PR', '80020-320'),
('55.666.777/0001-88', 'Logística Express EIRELI', 'LogExpress', 'EIRELI', '(51) 5012-3456', 'contato@logexpress.com.br', 'Carlos Ferreira', '(51) 5012-3457', 'operacoes@logexpress.com.br', 'www.logexpress.com.br', '49.30-2-02', 'Simples Nacional', 'Av. dos Transportes', '2000', 'Sarandi', 'Porto Alegre', 'RS', '91130-000');