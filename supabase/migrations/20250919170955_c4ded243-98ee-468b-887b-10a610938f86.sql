-- Insert sample activity logs for testing
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, entity_name, metadata) VALUES
  (auth.uid(), 'Cliente cadastrado', 'client', gen_random_uuid(), 'Empresa ABC Ltda', '{"operation": "INSERT", "cnpj": "12.345.678/0001-90"}'),
  (auth.uid(), 'PER/DCOMP criado', 'perdcomp', gen_random_uuid(), 'Empresa XYZ S.A.', '{"operation": "INSERT", "competencia": "2024-01", "imposto": "IRPJ", "valor": 15000}'),
  (auth.uid(), 'Cliente atualizado', 'client', gen_random_uuid(), 'Comércio Beta EIRELI', '{"operation": "UPDATE", "cnpj": "98.765.432/0001-10"}'),
  (auth.uid(), 'PER/DCOMP atualizado', 'perdcomp', gen_random_uuid(), 'Indústria Gama Ltda', '{"operation": "UPDATE", "competencia": "2024-02", "status": "Aprovado", "valor": 25000}'),
  (auth.uid(), 'Cliente cadastrado', 'client', gen_random_uuid(), 'Serviços Delta ME', '{"operation": "INSERT", "cnpj": "11.222.333/0001-44"}'),
  (auth.uid(), 'PER/DCOMP criado', 'perdcomp', gen_random_uuid(), 'Consultoria Epsilon Ltda', '{"operation": "INSERT", "competencia": "2024-03", "imposto": "CSLL", "valor": 8500}'),
  (auth.uid(), 'Cliente atualizado', 'client', gen_random_uuid(), 'Tech Zeta S.A.', '{"operation": "UPDATE", "cnpj": "55.666.777/0001-88"}'),
  (auth.uid(), 'PER/DCOMP removido', 'perdcomp', gen_random_uuid(), 'Logística Eta Ltda', '{"operation": "DELETE", "competencia": "2023-12"}');