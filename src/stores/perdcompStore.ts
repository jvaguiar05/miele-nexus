import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

// PerdComp interface matching Supabase table
interface PerdComp {
  id: string;
  client_id: string;
  numero: string;
  imposto: string;
  competencia: string;
  valor_solicitado: number;
  valor_recebido: number;
  status: string;
  data_transmissao?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

interface PerdCompState {
  perdcomps: PerdComp[];
  clientPerdComps: PerdComp[];
  selectedPerdComp: PerdComp | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  
  // Actions
  fetchPerdComps: (page?: number) => Promise<void>;
  fetchPerdCompById: (id: string) => Promise<PerdComp>;
  fetchPerdCompsByClient: (clientId: string) => Promise<void>;
  createPerdComp: (perdcompData: Partial<PerdComp>) => Promise<PerdComp>;
  updatePerdComp: (id: string, perdcompData: Partial<PerdComp>) => Promise<PerdComp>;
  deletePerdComp: (id: string) => Promise<void>;
  setSelectedPerdComp: (perdcomp: PerdComp | null) => void;
  searchPerdComps: (query: string) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

export const usePerdCompStore = create<PerdCompState>((set, get) => ({
  perdcomps: [],
  clientPerdComps: [],
  selectedPerdComp: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalCount: 0,

  fetchPerdComps: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const pageSize = get().pageSize;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('perdcomps')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      set({ 
        perdcomps: data || [], 
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Falha ao buscar PER/DCOMPs', isLoading: false });
    }
  },

  fetchPerdCompById: async (id: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('perdcomps')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      set({ selectedPerdComp: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: 'Falha ao buscar PER/DCOMP', isLoading: false });
      throw error;
    }
  },

  fetchPerdCompsByClient: async (clientId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('perdcomps')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ clientPerdComps: data || [], isLoading: false });
    } catch (error) {
      set({ error: 'Falha ao buscar PER/DCOMPs do cliente', isLoading: false });
    }
  },

  createPerdComp: async (perdcompData) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('perdcomps')
        .insert(perdcompData as any)
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({ 
        perdcomps: [data, ...state.perdcomps],
        clientPerdComps: perdcompData.client_id ? [data, ...state.clientPerdComps] : state.clientPerdComps,
        isLoading: false 
      }));
      return data;
    } catch (error) {
      set({ error: 'Falha ao criar PER/DCOMP', isLoading: false });
      throw error;
    }
  },

  updatePerdComp: async (id, perdcompData) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('perdcomps')
        .update(perdcompData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({
        perdcomps: state.perdcomps.map(pc => 
          pc.id === id ? data : pc
        ),
        clientPerdComps: state.clientPerdComps.map(pc =>
          pc.id === id ? data : pc
        ),
        selectedPerdComp: state.selectedPerdComp?.id === id ? data : state.selectedPerdComp,
        isLoading: false
      }));
      return data;
    } catch (error) {
      set({ error: 'Falha ao atualizar PER/DCOMP', isLoading: false });
      throw error;
    }
  },

  deletePerdComp: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('perdcomps')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        perdcomps: state.perdcomps.filter(pc => pc.id !== id),
        clientPerdComps: state.clientPerdComps.filter(pc => pc.id !== id),
        selectedPerdComp: state.selectedPerdComp?.id === id ? null : state.selectedPerdComp,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Falha ao deletar PER/DCOMP', isLoading: false });
      throw error;
    }
  },

  setSelectedPerdComp: (perdcomp) => set({ selectedPerdComp: perdcomp }),

  searchPerdComps: async (query) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('perdcomps')
        .select('*')
        .or(`numero.ilike.%${query}%,imposto.ilike.%${query}%,competencia.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ perdcomps: data || [], isLoading: false });
    } catch (error) {
      set({ error: 'Falha na busca', isLoading: false });
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),
}));