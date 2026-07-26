import type { EventPayload } from "./events";

// ---------------------------------------------------------------------------
// Routing Engine — determines target channels and providers for events
// ---------------------------------------------------------------------------

export interface RouteDecision {
  eventType: string;
  channels: string[];
  priority: number; // 1-10, higher = more urgent
  requiresRegulatoryOverride: boolean;
  regulator?: string;
}

const EVENT_PRIORITY: Record<string, number> = {
  margin_call: 10,
  suspicious_activity: 10,
  large_transaction_alert: 9,
  login_alert: 9,
  password_change: 8,
  kyc_expiry_reminder: 7,
  emi_reminder: 7,
  premium_due: 7,
  policy_renewal: 6,
  claim_status: 6,
  order_status: 5,
  trade_confirmation: 5,
  payment_confirmation: 5,
  price_alert: 4,
  portfolio_update: 3,
  dividend_credit: 3,
  corporate_action: 3,
  kyc_update: 3,
  account_closure: 3,
  loan_disbursement: 2,
  credit_score_update: 2,
  sip_debit: 2,
  nav_update: 1,
  upi_collect_request: 5,
  regulatory_update: 4,
  tax_statement: 2,
};

const REGULATORY_OVERRIDES: Record<string, { regulator: string; channel: string }> = {
  margin_call: { regulator: "SEBI", channel: "SMS" },
  trade_confirmation: { regulator: "SEBI", channel: "EMAIL" },
  payment_confirmation: { regulator: "RBI", channel: "SMS" },
  large_transaction_alert: { regulator: "RBI", channel: "SMS" },
  policy_renewal: { regulator: "IRDAI", channel: "EMAIL" },
  account_closure: { regulator: "SEBI", channel: "EMAIL" },
};

export function routeEvent(event: EventPayload): RouteDecision {
  const override = REGULATORY_OVERRIDES[event.type];

  if (override) {
    return {
      eventType: event.type,
      channels: [override.channel],
      priority: EVENT_PRIORITY[event.type] ?? 5,
      requiresRegulatoryOverride: true,
      regulator: override.regulator,
    };
  }

  return {
    eventType: event.type,
    channels: [], // Will be resolved from user preferences
    priority: EVENT_PRIORITY[event.type] ?? 5,
    requiresRegulatoryOverride: false,
  };
}

export function getPriority(eventType: string): number {
  return EVENT_PRIORITY[eventType] ?? 5;
}
