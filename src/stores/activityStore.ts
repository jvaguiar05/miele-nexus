import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  metadata: any;
  created_at: string;
}

interface ActivityStore {
  activities: ActivityLog[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  
  fetchActivities: (page?: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 5,
  
  fetchActivities: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { pageSize } = get();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // First get total count
      const { count } = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true });
      
      // Then fetch paginated data
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      set({ 
        activities: data || [], 
        totalCount: count || 0,
        currentPage: page,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  setCurrentPage: (page: number) => {
    const { fetchActivities } = get();
    fetchActivities(page);
  }
}));