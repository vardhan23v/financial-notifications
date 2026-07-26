// ---------------------------------------------------------------------------
// Financial Event Types — 25+ event types for Indian fintech platform
// ---------------------------------------------------------------------------

export type Channel = "EMAIL" | "SMS" | "PUSH" | "WHATSAPP" | "IN_APP";

export interface BaseEvent {
  id: string;
  type: string;
  userId: string;
  timestamp: string;
  correlationId?: string;
  payload: Record<string, unknown>;
}

// Trading & Brokerage
export interface MarginCallEvent extends BaseEvent {
  type: "margin_call";
  payload: {
    clientId: string;
    marginShortfall: number;
    deadline: string;
  };
}

export interface TradeConfirmationEvent extends BaseEvent {
  type: "trade_confirmation";
  payload: {
    clientId: string;
    tradeId: string;
    symbol: string;
    action: "BUY" | "SELL";
    quantity: number;
    price: number;
  };
}

export interface OrderStatusEvent extends BaseEvent {
  type: "order_status";
  payload: {
    orderId: string;
    status: "PENDING" | "EXECUTED" | "REJECTED" | "CANCELLED";
    symbol: string;
    reason?: string;
  };
}

export interface PriceAlertEvent extends BaseEvent {
  type: "price_alert";
  payload: {
    symbol: string;
    targetPrice: number;
    currentPrice: number;
    alertType: "ABOVE" | "BELOW";
  };
}

// Portfolio & Wealth
export interface PortfolioUpdateEvent extends BaseEvent {
  type: "portfolio_update";
  payload: {
    clientId: string;
    nav: number;
    changePercent: number;
    holdings: Array<{ symbol: string; value: number }>;
  };
}

export interface DividendCreditEvent extends BaseEvent {
  type: "dividend_credit";
  payload: {
    clientId: string;
    symbol: string;
    amount: number;
    exDate: string;
  };
}

export interface CorporateActionEvent extends BaseEvent {
  type: "corporate_action";
  payload: {
    clientId: string;
    symbol: string;
    actionType: "BONUS" | "SPLIT" | "RIGHTS" | "MERGER";
    details: string;
  };
}

// Payments & Transactions
export interface PaymentConfirmationEvent extends BaseEvent {
  type: "payment_confirmation";
  payload: {
    clientId: string;
    amount: number;
    method: "UPI" | "NEFT" | "RTGS" | "IMPS";
    txnId: string;
  };
}

export interface LargeTransactionAlertEvent extends BaseEvent {
  type: "large_transaction_alert";
  payload: {
    clientId: string;
    amount: number;
    txnType: "DEBIT" | "CREDIT";
    accountNumber: string;
  };
}

export interface UpiCollectRequestEvent extends BaseEvent {
  type: "upi_collect_request";
  payload: {
    clientId: string;
    amount: number;
    merchantName: string;
    vpa: string;
    expiry: string;
  };
}

// KYC & Compliance
export interface KycUpdateEvent extends BaseEvent {
  type: "kyc_update";
  payload: {
    clientId: string;
    status: "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";
    message: string;
  };
}

export interface KycExpiryReminderEvent extends BaseEvent {
  type: "kyc_expiry_reminder";
  payload: {
    clientId: string;
    expiryDate: string;
    daysRemaining: number;
  };
}

export interface AccountClosureEvent extends BaseEvent {
  type: "account_closure";
  payload: {
    clientId: string;
    reason: string;
    closureDate: string;
  };
}

// Insurance
export interface PolicyRenewalEvent extends BaseEvent {
  type: "policy_renewal";
  payload: {
    clientId: string;
    policyNumber: string;
    premium: number;
    dueDate: string;
  };
}

export interface ClaimStatusEvent extends BaseEvent {
  type: "claim_status";
  payload: {
    clientId: string;
    claimId: string;
    status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SETTLED";
    amount?: number;
  };
}

export interface PremiumDueEvent extends BaseEvent {
  type: "premium_due";
  payload: {
    clientId: string;
    policyNumber: string;
    premium: number;
    dueDate: string;
  };
}

// Lending
export interface EmiReminderEvent extends BaseEvent {
  type: "emi_reminder";
  payload: {
    clientId: string;
    loanId: string;
    emiAmount: number;
    dueDate: string;
  };
}

export interface LoanDisbursementEvent extends BaseEvent {
  type: "loan_disbursement";
  payload: {
    clientId: string;
    loanId: string;
    amount: number;
    disbursementDate: string;
  };
}

export interface CreditScoreUpdateEvent extends BaseEvent {
  type: "credit_score_update";
  payload: {
    clientId: string;
    score: number;
    change: number;
    bureau: "CIBIL" | "Experian" | "Equifax";
  };
}

// Mutual Funds
export interface SipDebitEvent extends BaseEvent {
  type: "sip_debit";
  payload: {
    clientId: string;
    folioNumber: string;
    amount: number;
    scheme: string;
    date: string;
  };
}

export interface NavUpdateEvent extends BaseEvent {
  type: "nav_update";
  payload: {
    scheme: string;
    nav: number;
    changePercent: number;
    date: string;
  };
}

// Security
export interface LoginAlertEvent extends BaseEvent {
  type: "login_alert";
  payload: {
    clientId: string;
    device: string;
    location: string;
    ip: string;
    timestamp: string;
  };
}

export interface PasswordChangeEvent extends BaseEvent {
  type: "password_change";
  payload: {
    clientId: string;
    changedAt: string;
    device: string;
  };
}

export interface SuspiciousActivityEvent extends BaseEvent {
  type: "suspicious_activity";
  payload: {
    clientId: string;
    activity: string;
    riskScore: number;
    details: string;
  };
}

// Regulatory
export interface RegulatoryUpdateEvent extends BaseEvent {
  type: "regulatory_update";
  payload: {
    regulator: string;
    updateType: string;
    summary: string;
    effectiveDate: string;
  };
}

export interface TaxStatementEvent extends BaseEvent {
  type: "tax_statement";
  payload: {
    clientId: string;
    fy: string;
    statementType: "AIS" | "TIS" | "26AS";
    availableDate: string;
  };
}

export type EventPayload =
  | MarginCallEvent
  | TradeConfirmationEvent
  | OrderStatusEvent
  | PriceAlertEvent
  | PortfolioUpdateEvent
  | DividendCreditEvent
  | CorporateActionEvent
  | PaymentConfirmationEvent
  | LargeTransactionAlertEvent
  | UpiCollectRequestEvent
  | KycUpdateEvent
  | KycExpiryReminderEvent
  | AccountClosureEvent
  | PolicyRenewalEvent
  | ClaimStatusEvent
  | PremiumDueEvent
  | EmiReminderEvent
  | LoanDisbursementEvent
  | CreditScoreUpdateEvent
  | SipDebitEvent
  | NavUpdateEvent
  | LoginAlertEvent
  | PasswordChangeEvent
  | SuspiciousActivityEvent
  | RegulatoryUpdateEvent
  | TaxStatementEvent;

export const EVENT_TYPES: string[] = [
  "margin_call",
  "trade_confirmation",
  "order_status",
  "price_alert",
  "portfolio_update",
  "dividend_credit",
  "corporate_action",
  "payment_confirmation",
  "large_transaction_alert",
  "upi_collect_request",
  "kyc_update",
  "kyc_expiry_reminder",
  "account_closure",
  "policy_renewal",
  "claim_status",
  "premium_due",
  "emi_reminder",
  "loan_disbursement",
  "credit_score_update",
  "sip_debit",
  "nav_update",
  "login_alert",
  "password_change",
  "suspicious_activity",
  "regulatory_update",
  "tax_statement",
];
