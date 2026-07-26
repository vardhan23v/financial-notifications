"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichEvent = enrichEvent;
function enrichEvent(event, user) {
    const enriched = { ...event.payload };
    const enrichments = [];
    // Add user name if available
    if (user?.name) {
        enriched.name = user.name;
        enrichments.push("user_name");
    }
    // Add formatted date
    enriched.date = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    enrichments.push("formatted_date");
    // Event-specific enrichments
    switch (event.type) {
        case "margin_call": {
            const shortfall = enriched.marginShortfall;
            enriched.shortfallFormatted = `₹${shortfall.toLocaleString("en-IN")}`;
            enriched.deadline = new Date(enriched.deadline).toLocaleDateString("en-IN");
            enrichments.push("margin_formatting");
            break;
        }
        case "trade_confirmation": {
            enriched.priceFormatted = `₹${enriched.price.toLocaleString("en-IN")}`;
            enrichments.push("price_formatting");
            break;
        }
        case "portfolio_update": {
            enriched.navFormatted = `₹${enriched.nav.toLocaleString("en-IN")}`;
            enriched.changeDirection = enriched.changePercent >= 0 ? "up" : "down";
            enrichments.push("nav_formatting");
            break;
        }
        case "payment_confirmation": {
            enriched.amountFormatted = `₹${enriched.amount.toLocaleString("en-IN")}`;
            enrichments.push("amount_formatting");
            break;
        }
        case "emi_reminder": {
            enriched.emiFormatted = `₹${enriched.emiAmount.toLocaleString("en-IN")}`;
            enriched.dueDateFormatted = new Date(enriched.dueDate).toLocaleDateString("en-IN");
            enrichments.push("emi_formatting");
            break;
        }
        case "policy_renewal":
        case "premium_due": {
            enriched.premiumFormatted = `₹${enriched.premium.toLocaleString("en-IN")}`;
            enriched.dueDateFormatted = new Date(enriched.dueDate).toLocaleDateString("en-IN");
            enrichments.push("premium_formatting");
            break;
        }
    }
    return {
        original: event.payload,
        enriched,
        metadata: {
            enrichedAt: new Date().toISOString(),
            enrichments,
        },
    };
}
//# sourceMappingURL=enrichment.js.map