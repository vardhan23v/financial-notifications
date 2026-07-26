import { findNotifications, type NotificationFilter } from "../repositories/notification";

// ---------------------------------------------------------------------------
// Notification Search Service — queries notification audit log with filters
// ---------------------------------------------------------------------------

export interface NotificationResult {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  eventType: string;
  channel: string;
  status: string;
  error?: string | null;
  createdAt: Date;
}

export async function searchNotifications(filter: NotificationFilter): Promise<{
  notifications: NotificationResult[];
  total: number;
}> {
  const result = await findNotifications(filter);

const notifications = result.notifications.map((n: { id: string; userId: string; user?: { name: string; email: string } | null; eventId: string; eventType: string; channel: string; status: string; error?: string | null; createdAt: Date }) => ({
    id: n.id,
    userId: n.userId,
    userName: n.user?.name ?? "Unknown",
    userEmail: n.user?.email ?? "",
    eventId: n.eventId,
    eventType: n.eventType,
    channel: n.channel,
    status: n.status,
    error: n.error,
    createdAt: n.createdAt,
  }));

  return { notifications, total: result.total };
}
