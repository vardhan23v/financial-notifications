import { getPrismaClient } from "../../../src/infrastructure/prisma";

// ---------------------------------------------------------------------------
// Tracking Repository — persistent delivery lifecycle tracking
//
// Every notification goes through states: PENDING → SENT | FAILED | DLQ.
// This repository writes and updates NotificationDelivery records so the
// system has a full audit trail of every delivery attempt.
// ---------------------------------------------------------------------------

/**
 * Creates a new delivery tracking record when a notification is first
 * dispatched. The record starts in PENDING state.
 */
export async function createTrackingRecord(dto: {
  notificationId: string;
  userId: string;
  channel: string;
  provider: string;
}): Promise<void> {
  const prisma = getPrismaClient();

  await prisma.notificationDelivery.create({
    data: {
      notificationId: dto.notificationId,
      userId: dto.userId,
      channel: dto.channel,
      provider: dto.provider,
      status: "PENDING",
      metadata: {},
    },
  });
}

/**
 * Updates the status (and optional metadata) of an existing delivery
 * tracking record. Typical status transitions:
 *
 *   PENDING → SENT   (delivery succeeded)
 *   PENDING → FAILED (delivery failed after retries)
 *   PENDING → DLQ    (exhausted retries, sent to dead letter queue)
 */
export async function updateTrackingStatus(
  notificationId: string,
  status: string,
  metadata?: object,
): Promise<void> {
  const prisma = getPrismaClient();

  await prisma.notificationDelivery.updateMany({
    where: { notificationId },
    data: {
      status,
      metadata: metadata ?? undefined,
      ...(status === "SENT" ? { sentAt: new Date() } : {}),
    },
  });
}