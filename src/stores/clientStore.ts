import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

// Client interface matching Supabase table
interface Client {
  id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  tipo_empresa: string;
  quadro_societario?: string;
  cargo?: string;
  telefone_contato?: string;
  email_contato?: string;
  responsavel_financeiro?: string;
  telefone_comercial?: string;
  email_comercial?: string;
  site?: string;
  cnae?: string;
  regime_tributario?: string;
  recuperacao_judicial?: boolean;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  atividades?: string;
  anotacoes_anteriores?: string;
  nova_anotacao?: string;
  created_at?: string;
  updated_at?: string;
}

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  
  // Actions
  fetchClients: (page?: number) => Promise<void>;
  fetchClientById: (id: string) => Promise<Client>;
  createClient: (clientData: Partial<Client>) => Promise<Client>;
  updateClient: (id: string, clientData: Partial<Client>) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  setSelectedClient: (client: Client | null) => void;
  searchClients: (query: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalCount: 0,

  fetchClients: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const pageSize = get().pageSize;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .order('razao_social', { ascending: true })
        .range(from, to);
      
      if (error) throw error;
      
      set({ 
        clients: data || [], 
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Falha ao buscar clientes', isLoading: false });
    }
  },

  fetchClientById: async (id: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      set({ selectedClient: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: 'Falha ao buscar cliente', isLoading: false });
      throw error;
    }
  },

  createClient: async (clientData) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData as any)
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({ 
        clients: [...state.clients, data],
        isLoading: false 
      }));
      return data;
    } catch (error) {
      set({ error: 'Falha ao criar cliente', isLoading: false });
      throw error;
    }
  },

  updateClient: async (id, clientData) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({
        clients: state.clients.map(client => 
          client.id === id ? data : client
        ),
        selectedClient: state.selectedClient?.id === id ? data : state.selectedClient,
        isLoading: false
      }));
      return data;
    } catch (error) {
      set({ error: 'Falha ao atualizar cliente', isLoading: false });
      throw error;
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        clients: state.clients.filter(client => client.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Falha ao deletar cliente', isLoading: false });
      throw error;
    }
  },

  setSelectedClient: (client) => set({ selectedClient: client }),

  searchClients: async (query) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`cnpj.ilike.%${query}%,razao_social.ilike.%${query}%,nome_fantasia.ilike.%${query}%`)
        .order('razao_social', { ascending: true });
      
      if (error) throw error;
      set({ clients: data || [], isLoading: false });
    } catch (error) {
      set({ error: 'Falha na busca', isLoading: false });
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),
}));