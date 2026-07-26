import { findTemplateByEventAndChannel } from "../repositories/template";
import { findActiveProvidersByChannel } from "../repositories/provider";
import { CircuitBreaker } from "../domain/circuit-breaker";
import { withRetry } from "../domain/retry";
import { renderTemplateFull } from "../domain/templates";
import type { EventPayload } from "../domain/events";

// ---------------------------------------------------------------------------
// Delivery Service — renders templates and dispatches via providers
// ---------------------------------------------------------------------------

export interface DeliveryResult {
  success: boolean;
  channel: string;
  provider?: string;
  error?: string;
  messageId?: string;
}

export async function deliverNotification(
  event: EventPayload,
  channel: string,
  enrichedPayload: Record<string, unknown>,
  locale: string = "en-IN",
): Promise<DeliveryResult> {
  // Find template
  const template = await findTemplateByEventAndChannel(event.type, channel);
  if (!template) {
    return {
      success: false,
      channel,
      error: `No template found for ${event.type}/${channel}`,
    };
  }

  // Render template with locale support
  const { subject, body } = await renderTemplateFull(template.id, locale, enrichedPayload);

  // Find active providers for channel
  const providers = await findActiveProvidersByChannel(channel);
  if (providers.length === 0) {
    return {
      success: false,
      channel,
      error: `No active providers for channel ${channel}`,
    };
  }

  // Try each provider with circuit breaker and retry
  for (const provider of providers) {
    const cb = new CircuitBreaker(provider.name);

    if (!cb.canExecute()) {
      continue;
    }

    try {
      const result = await withRetry(
        () => simulateDelivery(provider.name, channel, subject, body),
        { maxRetries: (provider.config as Record<string, number>).maxRetries ?? 3 },
      );

      cb.recordSuccess();
      return {
        success: true,
        channel,
        provider: provider.name,
        messageId: result.messageId,
      };
    } catch (err) {
      cb.recordFailure();
      const error = err instanceof Error ? err.message : String(err);

      // If this is the last provider, return failure
      if (provider === providers[providers.length - 1]) {
        return {
          success: false,
          channel,
          provider: provider.name,
          error,
        };
      }
    }
  }

  return {
    success: false,
    channel,
    error: "All providers exhausted",
  };
}

async function simulateDelivery(
  providerName: string,
  channel: string,
  subject: string,
  body: string,
): Promise<{ messageId: string }> {
  // Simulate delivery latency
  await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100));

  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    throw new Error(`Simulated delivery failure via ${providerName}`);
  }

  return { messageId: `${providerName}-${Date.now()}-${Math.random().toString(36).slice(2)}` };
}
