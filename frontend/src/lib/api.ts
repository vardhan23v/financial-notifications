import axios from "axios";

// ---------------------------------------------------------------------------
// API Client — Axios instance with correlation ID and error handling
// ---------------------------------------------------------------------------

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach correlation ID
api.interceptors.request.use((config) => {
  const correlationId =
    crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
  config.headers["X-Correlation-ID"] = correlationId;
  return config;
});

// Response interceptor: normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ?? err.message ?? "Unknown error";
    return Promise.reject(new Error(message));
  },
);

export default api;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SystemStatus {
  healthy: boolean;
  components: Array<{
    name: string;
    healthy: boolean;
    error?: string;
  }>;
  metrics: {
    notificationsSent: number;
    notificationsFailed: number;
    notificationsPending: number;
    dlqSize: number;
    totalNotifications: number;
  };
  providers: Array<{
    name: string;
    channel: string;
    healthy: boolean;
    active: boolean;
  }>;
  circuitBreakers: Array<{
    provider: string;
    state: string;
  }>;
  activeConsumers: number;
}

export interface Notification {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  eventType: string;
  channel: string;
  status: string;
  error?: string | null;
  createdAt: string;
}

export interface NotificationFilter {
  userId?: string;
  eventType?: string;
  channel?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  skip?: number;
  take?: number;
}

export interface NotificationResult {
  notifications: Notification[];
  total: number;
}

export interface EventPayload {
  type: string;
  userId: string;
  payload: Record<string, unknown>;
  correlationId?: string;
}

export interface DLQEntry {
  id: string;
  eventId: string;
  eventType: string;
  userId: string;
  error: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface Provider {
  id: string;
  name: string;
  channel: string;
  isActive: boolean;
  config?: Record<string, unknown>;
}

export interface Template {
  id: string;
  eventType: string;
  channel: string;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferences?: {
    channels: string[];
    quietHoursStart?: string;
    quietHoursEnd?: string;
    language?: string;
  };
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

export async function fetchSystemStatus(): Promise<SystemStatus> {
  const { data } = await api.get<SystemStatus>("/status");
  return data;
}

export async function submitEvent(payload: EventPayload): Promise<{ id: string }> {
  const { data } = await api.post<{ id: string }>("/events", payload);
  return data;
}

export async function fetchEventTypes(): Promise<string[]> {
  const { data } = await api.get<{ eventTypes: string[] }>("/events/types");
  return data.eventTypes;
}

export async function fetchNotifications(
  filter: NotificationFilter,
): Promise<NotificationResult> {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, val]) => {
    if (val !== undefined && val !== "") params.set(key, String(val));
  });
  const { data } = await api.get<NotificationResult>(
    `/notifications?${params.toString()}`,
  );
  return data;
}

export async function fetchDLQ(): Promise<{ entries: DLQEntry[]; total: number }> {
  const { data } = await api.get<{ entries: DLQEntry[]; total: number }>("/dlq");
  return data;
}

export async function replayDLQEntry(id: string): Promise<void> {
  await api.post(`/dlq/${id}/replay`);
}

export async function fetchProviders(): Promise<{ providers: Provider[]; total: number }> {
  const { data } = await api.get<{ providers: Provider[]; total: number }>("/providers");
  return data;
}

export async function toggleProvider(
  id: string,
  isActive: boolean,
): Promise<{ provider: Provider }> {
  const { data } = await api.patch<{ provider: Provider }>(`/providers/${id}`, {
    isActive,
  });
  return data;
}

export async function fetchTemplates(params?: {
  skip?: number;
  take?: number;
}): Promise<{ templates: Template[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.skip !== undefined) query.set("skip", String(params.skip));
  if (params?.take !== undefined) query.set("take", String(params.take));
  const { data } = await api.get<{ templates: Template[]; total: number }>(
    `/templates?${query.toString()}`,
  );
  return data;
}

export async function createTemplate(template: {
  eventType: string;
  channel: string;
  subject: string;
  body: string;
}): Promise<Template> {
  const { data } = await api.post<Template>("/templates", template);
  return data;
}

export async function updateTemplate(
  id: string,
  updates: { subject?: string; body?: string; isActive?: boolean },
): Promise<Template> {
  const { data } = await api.patch<Template>(`/templates/${id}`, updates);
  return data;
}

export async function deleteTemplate(id: string): Promise<void> {
  await api.delete(`/templates/${id}`);
}

export async function fetchUsers(params?: {
  skip?: number;
  take?: number;
}): Promise<{ users: User[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.skip !== undefined) query.set("skip", String(params.skip));
  if (params?.take !== undefined) query.set("take", String(params.take));
  const { data } = await api.get<{ users: User[]; total: number }>(
    `/users?${query.toString()}`,
  );
  return data;
}

export async function updateUserPreferences(
  userId: string,
  preferences: {
    channels?: string[];
    quietHoursStart?: string;
    quietHoursEnd?: string;
    language?: string;
  },
): Promise<User> {
  const { data } = await api.patch<User>(
    `/users/${userId}/preferences`,
    preferences,
  );
  return data;
}

export async function fetchProxiedWebsite(url: string): Promise<string> {
  const { data } = await api.get<string>("/proxy/website", {
    params: { url },
    responseType: "text",
  });
  return data;
}

// ---------------------------------------------------------------------------
// Real-time Analytics (SSE)
// ---------------------------------------------------------------------------

export interface MetricsSnapshot {
  windowStart: string;
  windowEnd: string;
  totalEvents: number;
  byChannel: Record<string, number>;
  byStatus: Record<string, number>;
  byEventType: Record<string, number>;
  avgDurationMs: number;
}

/**
 * Subscribes to the real-time analytics SSE stream.
 * Returns an unsubscribe function — call it to close the EventSource.
 */
export function subscribeMetrics(
  callback: (snapshot: MetricsSnapshot) => void,
): () => void {
  const es = new EventSource("/api/analytics/stream");

  es.onmessage = (event) => {
    try {
      const snapshot: MetricsSnapshot = JSON.parse(event.data);
      callback(snapshot);
    } catch {
      // Ignore malformed messages
    }
  };

  es.onerror = () => {
    // EventSource will auto-reconnect; no action needed
  };

  return () => {
    es.close();
  };
}