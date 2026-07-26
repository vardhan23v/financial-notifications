import type { EventPayload } from "../domain/events";
import { resolveChannels } from "../domain/channels";
import { enrichEvent } from "../domain/enrichment";
import { createNotification, updateNotificationStatus } from "../repositories/notification";
import { findUserById } from "../repositories/user";
import { deliverNotification } from "./delivery";
import { getLogger } from "../../../src/logging";
import { recordMetric } from "../../../src/metrics";

// ---------------------------------------------------------------------------
// Message Processor — processes events from Kafka/RabbitMQ
// ---------------------------------------------------------------------------

export interface Message {
  id: string;
  type: string;
  userId: string;
  timestamp: string;
  correlationId?: string;
  payload: Record<string, unknown>;
}

export async function processMessage(msg: Message): Promise<void> {
  const log = getLogger();
  log.info({ msgId: msg.id, type: msg.type, userId: msg.userId }, "Processing message");

  // Find user
  const user = await findUserById(msg.userId);
  if (!user) {
    log.warn({ userId: msg.userId }, "User not found");
    throw new Error(`User not found: ${msg.userId}`);
  }

  // Resolve channels
  const event = msg as EventPayload;
  const resolution = resolveChannels(event, user.preferences);

  if (resolution.channels.length === 0) {
    log.warn({ msgId: msg.id }, "No channels resolved");
    throw new Error("No channels resolved for event");
  }

  // Enrich payload
  const enriched = enrichEvent(event, user);

  // Deliver to each channel
  for (const channel of resolution.channels) {
    const notification = await createNotification({
      userId: msg.userId,
      eventId: msg.id,
      eventType: msg.type,
      channel,
      status: "PENDING",
    });

    try {
      const locale = user.preferences?.language ?? "en-IN";
      const result = await deliverNotification(event, channel, enriched.enriched, locale);

      if (result.success) {
        await updateNotificationStatus(notification.id, "SENT");
        recordMetric("notifications_sent_total", 1, { channel, type: msg.type });
        log.info({ msgId: msg.id, channel, provider: result.provider }, "Notification sent");
      } else {
        await updateNotificationStatus(notification.id, "FAILED", result.error);
        recordMetric("notifications_failed_total", 1, { channel, type: msg.type });
        log.warn({ msgId: msg.id, channel, error: result.error }, "Notification failed");
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      await updateNotificationStatus(notification.id, "FAILED", error);
      recordMetric("notifications_failed_total", 1, { channel, type: msg.type });
      log.error({ msgId: msg.id, channel, error }, "Notification delivery error");
    }
  }
}
