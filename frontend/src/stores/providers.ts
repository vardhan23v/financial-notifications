import { create } from "zustand";
import {
  fetchProviders,
  toggleProvider,
  type Provider,
} from "../lib/api";

interface ProviderStore {
  providers: Provider[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggle: (id: string, isActive: boolean) => Promise<void>;
}

export const useProviderStore = create<ProviderStore>((set) => ({
  providers: [],
  loading: false,
  error: null,
  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const result = await fetchProviders();
      set({ providers: result.providers, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch providers",
        loading: false,
      });
    }
  },
  toggle: async (id, isActive) => {
    try {
      const result = await toggleProvider(id, isActive);
      set((s) => ({
        providers: s.providers.map((p) =>
          p.id === id ? result.provider : p,
        ),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to toggle provider",
      });
    }
  },
}));