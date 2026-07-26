import type { EventPayload } from "./events";

// ---------------------------------------------------------------------------
// Enrichment — adds contextual data to events before delivery
// ---------------------------------------------------------------------------

export interface EnrichedPayload {
  original: Record<string, unknown>;
  enriched: Record<string, unknown>;
  metadata: {
    enrichedAt: string;
    enrichments: string[];
  };
}

export function enrichEvent(event: EventPayload, user?: { name: string; email: string; phone?: string | null }): EnrichedPayload {
  const enriched: Record<string, unknown> = { ...event.payload };
  const enrichments: string[] = [];

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
      const shortfall = enriched.marginShortfall as number;
      enriched.shortfallFormatted = `₹${shortfall.toLocaleString("en-IN")}`;
      enriched.deadline = new Date(enriched.deadline as string).toLocaleDateString("en-IN");
      enrichments.push("margin_formatting");
      break;
    }
    case "trade_confirmation": {
      enriched.priceFormatted = `₹${(enriched.price as number).toLocaleString("en-IN")}`;
      enrichments.push("price_formatting");
      break;
    }
    case "portfolio_update": {
      enriched.navFormatted = `₹${(enriched.nav as number).toLocaleString("en-IN")}`;
      enriched.changeDirection = (enriched.changePercent as number) >= 0 ? "up" : "down";
      enrichments.push("nav_formatting");
      break;
    }
    case "payment_confirmation": {
      enriched.amountFormatted = `₹${(enriched.amount as number).toLocaleString("en-IN")}`;
      enrichments.push("amount_formatting");
      break;
    }
    case "emi_reminder": {
      enriched.emiFormatted = `₹${(enriched.emiAmount as number).toLocaleString("en-IN")}`;
      enriched.dueDateFormatted = new Date(enriched.dueDate as string).toLocaleDateString("en-IN");
      enrichments.push("emi_formatting");
      break;
    }
    case "policy_renewal":
    case "premium_due": {
      enriched.premiumFormatted = `₹${(enriched.premium as number).toLocaleString("en-IN")}`;
      enriched.dueDateFormatted = new Date(enriched.dueDate as string).toLocaleDateString("en-IN");
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
