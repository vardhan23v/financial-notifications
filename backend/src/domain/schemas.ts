import { z } from "zod";
import type { EventPayload } from "./events";

// ---------------------------------------------------------------------------
// Zod validation schemas for all 25+ financial event types
// ---------------------------------------------------------------------------

export const baseEventSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  userId: z.string().uuid(),
  timestamp: z.string().datetime(),
  correlationId: z.string().uuid().optional(),
  payload: z.record(z.unknown()),
});

// Trading & Brokerage
export const marginCallSchema = baseEventSchema.extend({
  type: z.literal("margin_call"),
  payload: z.object({
    clientId: z.string(),
    marginShortfall: z.number().positive(),
    deadline: z.string().datetime(),
  }),
});

export const tradeConfirmationSchema = baseEventSchema.extend({
  type: z.literal("trade_confirmation"),
  payload: z.object({
    clientId: z.string(),
    tradeId: z.string(),
    symbol: z.string(),
    action: z.enum(["BUY", "SELL"]),
    quantity: z.number().positive(),
    price: z.number().positive(),
  }),
});

export const orderStatusSchema = baseEventSchema.extend({
  type: z.literal("order_status"),
  payload: z.object({
    orderId: z.string(),
    status: z.enum(["PENDING", "EXECUTED", "REJECTED", "CANCELLED"]),
    symbol: z.string(),
    reason: z.string().optional(),
  }),
});

export const priceAlertSchema = baseEventSchema.extend({
  type: z.literal("price_alert"),
  payload: z.object({
    symbol: z.string(),
    targetPrice: z.number().positive(),
    currentPrice: z.number().positive(),
    alertType: z.enum(["ABOVE", "BELOW"]),
  }),
});

// Portfolio & Wealth
export const portfolioUpdateSchema = baseEventSchema.extend({
  type: z.literal("portfolio_update"),
  payload: z.object({
    clientId: z.string(),
    nav: z.number().positive(),
    changePercent: z.number(),
    holdings: z.array(z.object({ symbol: z.string(), value: z.number() })),
  }),
});

export const dividendCreditSchema = baseEventSchema.extend({
  type: z.literal("dividend_credit"),
  payload: z.object({
    clientId: z.string(),
    symbol: z.string(),
    amount: z.number().positive(),
    exDate: z.string().datetime(),
  }),
});

export const corporateActionSchema = baseEventSchema.extend({
  type: z.literal("corporate_action"),
  payload: z.object({
    clientId: z.string(),
    symbol: z.string(),
    actionType: z.enum(["BONUS", "SPLIT", "RIGHTS", "MERGER"]),
    details: z.string(),
  }),
});

// Payments & Transactions
export const paymentConfirmationSchema = baseEventSchema.extend({
  type: z.literal("payment_confirmation"),
  payload: z.object({
    clientId: z.string(),
    amount: z.number().positive(),
    method: z.enum(["UPI", "NEFT", "RTGS", "IMPS"]),
    txnId: z.string(),
  }),
});

export const largeTransactionAlertSchema = baseEventSchema.extend({
  type: z.literal("large_transaction_alert"),
  payload: z.object({
    clientId: z.string(),
    amount: z.number().positive(),
    txnType: z.enum(["DEBIT", "CREDIT"]),
    accountNumber: z.string(),
  }),
});

export const upiCollectRequestSchema = baseEventSchema.extend({
  type: z.literal("upi_collect_request"),
  payload: z.object({
    clientId: z.string(),
    amount: z.number().positive(),
    merchantName: z.string(),
    vpa: z.string(),
    expiry: z.string().datetime(),
  }),
});

// KYC & Compliance
export const kycUpdateSchema = baseEventSchema.extend({
  type: z.literal("kyc_update"),
  payload: z.object({
    clientId: z.string(),
    status: z.enum(["PENDING", "VERIFIED", "REJECTED", "EXPIRED"]),
    message: z.string(),
  }),
});

export const kycExpiryReminderSchema = baseEventSchema.extend({
  type: z.literal("kyc_expiry_reminder"),
  payload: z.object({
    clientId: z.string(),
    expiryDate: z.string().datetime(),
    daysRemaining: z.number().int().nonnegative(),
  }),
});

export const accountClosureSchema = baseEventSchema.extend({
  type: z.literal("account_closure"),
  payload: z.object({
    clientId: z.string(),
    reason: z.string(),
    closureDate: z.string().datetime(),
  }),
});

// Insurance
export const policyRenewalSchema = baseEventSchema.extend({
  type: z.literal("policy_renewal"),
  payload: z.object({
    clientId: z.string(),
    policyNumber: z.string(),
    premium: z.number().positive(),
    dueDate: z.string().datetime(),
  }),
});

export const claimStatusSchema = baseEventSchema.extend({
  type: z.literal("claim_status"),
  payload: z.object({
    clientId: z.string(),
    claimId: z.string(),
    status: z.enum(["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "SETTLED"]),
    amount: z.number().positive().optional(),
  }),
});

export const premiumDueSchema = baseEventSchema.extend({
  type: z.literal("premium_due"),
  payload: z.object({
    clientId: z.string(),
    policyNumber: z.string(),
    premium: z.number().positive(),
    dueDate: z.string().datetime(),
  }),
});

// Lending
export const emiReminderSchema = baseEventSchema.extend({
  type: z.literal("emi_reminder"),
  payload: z.object({
    clientId: z.string(),
    loanId: z.string(),
    emiAmount: z.number().positive(),
    dueDate: z.string().datetime(),
  }),
});

export const loanDisbursementSchema = baseEventSchema.extend({
  type: z.literal("loan_disbursement"),
  payload: z.object({
    clientId: z.string(),
    loanId: z.string(),
    amount: z.number().positive(),
    disbursementDate: z.string().datetime(),
  }),
});

export const creditScoreUpdateSchema = baseEventSchema.extend({
  type: z.literal("credit_score_update"),
  payload: z.object({
    clientId: z.string(),
    score: z.number().int().min(300).max(900),
    change: z.number(),
    bureau: z.enum(["CIBIL", "Experian", "Equifax"]),
  }),
});

// Mutual Funds
export const sipDebitSchema = baseEventSchema.extend({
  type: z.literal("sip_debit"),
  payload: z.object({
    clientId: z.string(),
    folioNumber: z.string(),
    amount: z.number().positive(),
    scheme: z.string(),
    date: z.string().datetime(),
  }),
});

export const navUpdateSchema = baseEventSchema.extend({
  type: z.literal("nav_update"),
  payload: z.object({
    scheme: z.string(),
    nav: z.number().positive(),
    changePercent: z.number(),
    date: z.string().datetime(),
  }),
});

// Security
export const loginAlertSchema = baseEventSchema.extend({
  type: z.literal("login_alert"),
  payload: z.object({
    clientId: z.string(),
    device: z.string(),
    location: z.string(),
    ip: z.string(),
    timestamp: z.string().datetime(),
  }),
});

export const passwordChangeSchema = baseEventSchema.extend({
  type: z.literal("password_change"),
  payload: z.object({
    clientId: z.string(),
    changedAt: z.string().datetime(),
    device: z.string(),
  }),
});

export const suspiciousActivitySchema = baseEventSchema.extend({
  type: z.literal("suspicious_activity"),
  payload: z.object({
    clientId: z.string(),
    activity: z.string(),
    riskScore: z.number().min(0).max(100),
    details: z.string(),
  }),
});

// Regulatory
export const regulatoryUpdateSchema = baseEventSchema.extend({
  type: z.literal("regulatory_update"),
  payload: z.object({
    regulator: z.string(),
    updateType: z.string(),
    summary: z.string(),
    effectiveDate: z.string().datetime(),
  }),
});

export const taxStatementSchema = baseEventSchema.extend({
  type: z.literal("tax_statement"),
  payload: z.object({
    clientId: z.string(),
    fy: z.string(),
    statementType: z.enum(["AIS", "TIS", "26AS"]),
    availableDate: z.string().datetime(),
  }),
});

export const eventPayloadSchema = z.discriminatedUnion("type", [
  marginCallSchema,
  tradeConfirmationSchema,
  orderStatusSchema,
  priceAlertSchema,
  portfolioUpdateSchema,
  dividendCreditSchema,
  corporateActionSchema,
  paymentConfirmationSchema,
  largeTransactionAlertSchema,
  upiCollectRequestSchema,
  kycUpdateSchema,
  kycExpiryReminderSchema,
  accountClosureSchema,
  policyRenewalSchema,
  claimStatusSchema,
  premiumDueSchema,
  emiReminderSchema,
  loanDisbursementSchema,
  creditScoreUpdateSchema,
  sipDebitSchema,
  navUpdateSchema,
  loginAlertSchema,
  passwordChangeSchema,
  suspiciousActivitySchema,
  regulatoryUpdateSchema,
  taxStatementSchema,
]);

export type ValidatedEvent = z.infer<typeof eventPayloadSchema>;

/**
 * Validates an unknown input against the full discriminated union of
 * financial event types. Returns a typed EventPayload on success or
 * throws a ZodError with detailed validation messages on failure.
 */
export function validateEvent(input: unknown): EventPayload {
  const result = eventPayloadSchema.safeParse(input);
  if (!result.success) {
    throw result.error;
  }
  return result.data as EventPayload;
}
