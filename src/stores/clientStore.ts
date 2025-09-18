import { create } from 'zustand';
import api from '@/lib/api';
import { Client } from '@/types/api';

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchClients: () => Promise<void>;
  fetchClientById: (id: number) => Promise<Client>;
  createClient: (clientData: Partial<Client>) => Promise<Client>;
  updateClient: (id: number, clientData: Partial<Client>) => Promise<Client>;
  deleteClient: (id: number) => Promise<void>;
  setSelectedClient: (client: Client | null) => void;
  searchClients: (query: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/clients/');
      set({ clients: response.data.results || response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch clients', isLoading: false });
    }
  },

  fetchClientById: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/clients/${id}/`);
      const client = response.data;
      set({ selectedClient: client, isLoading: false });
      return client;
    } catch (error) {
      set({ error: 'Failed to fetch client', isLoading: false });
      throw error;
    }
  },

  createClient: async (clientData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/clients/', clientData);
      const newClient = response.data;
      set(state => ({ 
        clients: [...state.clients, newClient],
        isLoading: false 
      }));
      return newClient;
    } catch (error) {
      set({ error: 'Failed to create client', isLoading: false });
      throw error;
    }
  },

  updateClient: async (id, clientData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/clients/${id}/`, clientData);
      const updatedClient = response.data;
      set(state => ({
        clients: state.clients.map(client => 
          client.id === id ? updatedClient : client
        ),
        selectedClient: state.selectedClient?.id === id ? updatedClient : state.selectedClient,
        isLoading: false
      }));
      return updatedClient;
    } catch (error) {
      set({ error: 'Failed to update client', isLoading: false });
      throw error;
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/clients/${id}/`);
      set(state => ({
        clients: state.clients.filter(client => client.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete client', isLoading: false });
      throw error;
    }
  },

  setSelectedClient: (client) => set({ selectedClient: client }),

  searchClients: async (query) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/clients/?search=${encodeURIComponent(query)}`);
      set({ clients: response.data.results || response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Search failed', isLoading: false });
    }
  },
}));