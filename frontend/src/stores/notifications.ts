import { create } from "zustand";
import {
  fetchNotifications,
  type Notification,
  type NotificationFilter,
} from "../lib/api";

interface NotificationStore {
  notifications: Notification[];
  total: number;
  loading: boolean;
  error: string | null;
  filter: NotificationFilter;
  setFilter: (filter: Partial<NotificationFilter>) => void;
  refresh: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  total: 0,
  loading: false,
  error: null,
  filter: { take: 20, skip: 0 },
  setFilter: (partial) => {
    set((s) => ({ filter: { ...s.filter, ...partial, skip: 0 } }));
  },
  refresh: async () => {
    const { filter } = get();
    set({ loading: true, error: null });
    try {
      const result = await fetchNotifications(filter);
      set({
        notifications: result.notifications,
        total: result.total,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch notifications",
        loading: false,
      });
    }
  },
}));