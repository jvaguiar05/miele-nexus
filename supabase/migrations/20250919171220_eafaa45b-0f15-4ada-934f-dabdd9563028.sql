-- Create sample activity logs with different timestamps for testing
-- Using a temporary user ID for demonstration
DO $$
DECLARE
  sample_user_id UUID := gen_random_uuid();
BEGIN
  -- Insert sample activity logs with different timestamps
  INSERT INTO activity_logs (user_id, action, entity_type, entity_id, entity_name, metadata, created_at) VALUES
    (sample_user_id, 'Cliente cadastrado', 'client', gen_random_uuid(), 'Empresa ABC Ltda', '{"operation": "INSERT", "cnpj": "12.345.678/0001-90"}', NOW() - INTERVAL '2 hours'),
    (sample_user_id, 'PER/DCOMP criado', 'perdcomp', gen_random_uuid(), 'Empresa XYZ S.A.', '{"operation": "INSERT", "competencia": "2024-01", "imposto": "IRPJ", "valor": 15000}', NOW() - INTERVAL '4 hours'),
    (sample_user_id, 'Cliente atualizado', 'client', gen_random_uuid(), 'Comércio Beta EIRELI', '{"operation": "UPDATE", "cnpj": "98.765.432/0001-10"}', NOW() - INTERVAL '6 hours'),
    (sample_user_id, 'PER/DCOMP atualizado', 'perdcomp', gen_random_uuid(), 'Indústria Gama Ltda', '{"operation": "UPDATE", "competencia": "2024-02", "status": "Aprovado", "valor": 25000}', NOW() - INTERVAL '1 day'),
    (sample_user_id, 'Cliente cadastrado', 'client', gen_random_uuid(), 'Serviços Delta ME', '{"operation": "INSERT", "cnpj": "11.222.333/0001-44"}', NOW() - INTERVAL '2 days'),
    (sample_user_id, 'PER/DCOMP criado', 'perdcomp', gen_random_uuid(), 'Consultoria Epsilon Ltda', '{"operation": "INSERT", "competencia": "2024-03", "imposto": "CSLL", "valor": 8500}', NOW() - INTERVAL '3 days'),
    (sample_user_id, 'Cliente atualizado', 'client', gen_random_uuid(), 'Tech Zeta S.A.', '{"operation": "UPDATE", "cnpj": "55.666.777/0001-88"}', NOW() - INTERVAL '5 days'),
    (sample_user_id, 'PER/DCOMP removido', 'perdcomp', gen_random_uuid(), 'Logística Eta Ltda', '{"operation": "DELETE", "competencia": "2023-12"}', NOW() - INTERVAL '1 week');
    
  -- Temporarily disable RLS to allow viewing sample data
  ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
END $$;