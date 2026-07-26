import { create } from "zustand";
import {
  fetchSystemStatus,
  type SystemStatus,
} from "../lib/api";

interface SystemStore {
  status: SystemStatus | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  refresh: () => Promise<void>;
}

export const useSystemStore = create<SystemStore>((set) => ({
  status: null,
  loading: false,
  error: null,
  lastUpdated: null,
  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const status = await fetchSystemStatus();
      set({ status, loading: false, lastUpdated: Date.now() });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch status",
        loading: false,
      });
    }
  },
}));