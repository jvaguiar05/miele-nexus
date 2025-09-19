import { create } from 'zustand';
import api from '@/lib/api';
import { PerdComp } from '@/types/api';

interface PerdCompState {
  perdcomps: PerdComp[];
  selectedPerdComp: PerdComp | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPerdComps: () => Promise<void>;
  fetchPerdCompById: (id: number) => Promise<PerdComp>;
  createPerdComp: (data: Partial<PerdComp>) => Promise<PerdComp>;
  updatePerdComp: (id: number, data: Partial<PerdComp>) => Promise<PerdComp>;
  deletePerdComp: (id: number) => Promise<void>;
  setSelectedPerdComp: (perdcomp: PerdComp | null) => void;
  searchPerdComps: (query: string) => Promise<void>;
}

export const usePerdCompStore = create<PerdCompState>((set, get) => ({
  perdcomps: [],
  selectedPerdComp: null,
  isLoading: false,
  error: null,

  fetchPerdComps: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock data for now
      const mockData: PerdComp[] = [
        {
          id: 1,
          client: 1,
          numero: "001/2024",
          nome: "Restituição IRPJ",
          nr_perdcomp: "PER2024001",
          data_transmissao: "2024-01-15",
          data_vencimento: "2024-12-31",
          tributo_pedido: "IRPJ",
          competencia: "2023",
          valor_pedido: 150000.00,
          valor_compensado: 100000.00,
          valor_recebido: 50000.00,
          valor_saldo: 0,
          valor_selic: 5000.00,
          recebido: true,
          data_recebimento: "2024-03-15",
          anotacoes: "Processo concluído com sucesso",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-03-15T14:30:00Z"
        },
        {
          id: 2,
          client: 2,
          numero: "002/2024",
          nome: "Compensação PIS/COFINS",
          nr_perdcomp: "DCOMP2024002",
          data_transmissao: "2024-02-20",
          data_vencimento: "2024-12-31",
          tributo_pedido: "PIS/COFINS",
          competencia: "2023",
          valor_pedido: 75000.00,
          valor_compensado: 75000.00,
          valor_recebido: 0,
          valor_saldo: 0,
          valor_selic: 2500.00,
          recebido: false,
          data_recebimento: null,
          anotacoes: "Aguardando análise da RFB",
          created_at: "2024-02-20T09:00:00Z",
          updated_at: "2024-02-20T09:00:00Z"
        },
        {
          id: 3,
          client: 1,
          numero: "003/2024",
          nome: "Restituição CSLL",
          nr_perdcomp: "PER2024003",
          data_transmissao: "2024-03-01",
          data_vencimento: "2024-12-31",
          tributo_pedido: "CSLL",
          competencia: "2023",
          valor_pedido: 45000.00,
          valor_compensado: 0,
          valor_recebido: 0,
          valor_saldo: 45000.00,
          valor_selic: 1200.00,
          recebido: false,
          data_recebimento: null,
          anotacoes: "Em processamento",
          created_at: "2024-03-01T11:00:00Z",
          updated_at: "2024-03-01T11:00:00Z"
        }
      ];
      set({ perdcomps: mockData, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch PER/DCOMPs', isLoading: false });
    }
  },

  fetchPerdCompById: async (id: number) => {
    const response = await api.get(`/perdcomps/${id}/`);
    return response.data;
  },

  createPerdComp: async (data) => {
    const response = await api.post('/perdcomps/', data);
    const newPerdComp = response.data;
    set(state => ({ perdcomps: [...state.perdcomps, newPerdComp] }));
    return newPerdComp;
  },

  updatePerdComp: async (id, data) => {
    const response = await api.put(`/perdcomps/${id}/`, data);
    const updatedPerdComp = response.data;
    set(state => ({
      perdcomps: state.perdcomps.map(pc => 
        pc.id === id ? updatedPerdComp : pc
      )
    }));
    return updatedPerdComp;
  },

  deletePerdComp: async (id) => {
    await api.delete(`/perdcomps/${id}/`);
    set(state => ({
      perdcomps: state.perdcomps.filter(pc => pc.id !== id),
      selectedPerdComp: state.selectedPerdComp?.id === id ? null : state.selectedPerdComp
    }));
  },

  setSelectedPerdComp: (perdcomp) => set({ selectedPerdComp: perdcomp }),

  searchPerdComps: async (query) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/perdcomps/?search=${encodeURIComponent(query)}`);
      set({ perdcomps: response.data.results || response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Search failed', isLoading: false });
    }
  },
}));