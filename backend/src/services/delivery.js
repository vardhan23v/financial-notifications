"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliverNotification = deliverNotification;
const template_1 = require("../repositories/template");
const provider_1 = require("../repositories/provider");
const circuit_breaker_1 = require("../domain/circuit-breaker");
const retry_1 = require("../domain/retry");
const templates_1 = require("../domain/templates");
async function deliverNotification(event, channel, enrichedPayload, locale = "en-IN") {
    // Find template
    const template = await (0, template_1.findTemplateByEventAndChannel)(event.type, channel);
    if (!template) {
        return {
            success: false,
            channel,
            error: `No template found for ${event.type}/${channel}`,
        };
    }
    // Render template with locale support
    const { subject, body } = await (0, templates_1.renderTemplateFull)(template.id, locale, enrichedPayload);
    // Find active providers for channel
    const providers = await (0, provider_1.findActiveProvidersByChannel)(channel);
    if (providers.length === 0) {
        return {
            success: false,
            channel,
            error: `No active providers for channel ${channel}`,
        };
    }
    // Try each provider with circuit breaker and retry
    for (const provider of providers) {
        const cb = new circuit_breaker_1.CircuitBreaker(provider.name);
        if (!cb.canExecute()) {
            continue;
        }
        try {
            const result = await (0, retry_1.withRetry)(() => simulateDelivery(provider.name, channel, subject, body), { maxRetries: provider.config.maxRetries ?? 3 });
            cb.recordSuccess();
            return {
                success: true,
                channel,
                provider: provider.name,
                messageId: result.messageId,
            };
        }
        catch (err) {
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
async function simulateDelivery(providerName, channel, subject, body) {
    // Simulate delivery latency
    await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100));
    // Simulate occasional failures (5% chance)
    if (Math.random() < 0.05) {
        throw new Error(`Simulated delivery failure via ${providerName}`);
    }
    return { messageId: `${providerName}-${Date.now()}-${Math.random().toString(36).slice(2)}` };
}
//# sourceMappingURL=delivery.js.map