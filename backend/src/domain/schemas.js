"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventPayloadSchema = exports.taxStatementSchema = exports.regulatoryUpdateSchema = exports.suspiciousActivitySchema = exports.passwordChangeSchema = exports.loginAlertSchema = exports.navUpdateSchema = exports.sipDebitSchema = exports.creditScoreUpdateSchema = exports.loanDisbursementSchema = exports.emiReminderSchema = exports.premiumDueSchema = exports.claimStatusSchema = exports.policyRenewalSchema = exports.accountClosureSchema = exports.kycExpiryReminderSchema = exports.kycUpdateSchema = exports.upiCollectRequestSchema = exports.largeTransactionAlertSchema = exports.paymentConfirmationSchema = exports.corporateActionSchema = exports.dividendCreditSchema = exports.portfolioUpdateSchema = exports.priceAlertSchema = exports.orderStatusSchema = exports.tradeConfirmationSchema = exports.marginCallSchema = exports.baseEventSchema = void 0;
exports.validateEvent = validateEvent;
const zod_1 = require("zod");
// ---------------------------------------------------------------------------
// Zod validation schemas for all 25+ financial event types
// ---------------------------------------------------------------------------
exports.baseEventSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.string(),
    userId: zod_1.z.string().uuid(),
    timestamp: zod_1.z.string().datetime(),
    correlationId: zod_1.z.string().uuid().optional(),
    payload: zod_1.z.record(zod_1.z.unknown()),
});
// Trading & Brokerage
exports.marginCallSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("margin_call"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        marginShortfall: zod_1.z.number().positive(),
        deadline: zod_1.z.string().datetime(),
    }),
});
exports.tradeConfirmationSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("trade_confirmation"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        tradeId: zod_1.z.string(),
        symbol: zod_1.z.string(),
        action: zod_1.z.enum(["BUY", "SELL"]),
        quantity: zod_1.z.number().positive(),
        price: zod_1.z.number().positive(),
    }),
});
exports.orderStatusSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("order_status"),
    payload: zod_1.z.object({
        orderId: zod_1.z.string(),
        status: zod_1.z.enum(["PENDING", "EXECUTED", "REJECTED", "CANCELLED"]),
        symbol: zod_1.z.string(),
        reason: zod_1.z.string().optional(),
    }),
});
exports.priceAlertSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("price_alert"),
    payload: zod_1.z.object({
        symbol: zod_1.z.string(),
        targetPrice: zod_1.z.number().positive(),
        currentPrice: zod_1.z.number().positive(),
        alertType: zod_1.z.enum(["ABOVE", "BELOW"]),
    }),
});
// Portfolio & Wealth
exports.portfolioUpdateSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("portfolio_update"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        nav: zod_1.z.number().positive(),
        changePercent: zod_1.z.number(),
        holdings: zod_1.z.array(zod_1.z.object({ symbol: zod_1.z.string(), value: zod_1.z.number() })),
    }),
});
exports.dividendCreditSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("dividend_credit"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        symbol: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        exDate: zod_1.z.string().datetime(),
    }),
});
exports.corporateActionSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("corporate_action"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        symbol: zod_1.z.string(),
        actionType: zod_1.z.enum(["BONUS", "SPLIT", "RIGHTS", "MERGER"]),
        details: zod_1.z.string(),
    }),
});
// Payments & Transactions
exports.paymentConfirmationSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("payment_confirmation"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        method: zod_1.z.enum(["UPI", "NEFT", "RTGS", "IMPS"]),
        txnId: zod_1.z.string(),
    }),
});
exports.largeTransactionAlertSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("large_transaction_alert"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        txnType: zod_1.z.enum(["DEBIT", "CREDIT"]),
        accountNumber: zod_1.z.string(),
    }),
});
exports.upiCollectRequestSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("upi_collect_request"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        merchantName: zod_1.z.string(),
        vpa: zod_1.z.string(),
        expiry: zod_1.z.string().datetime(),
    }),
});
// KYC & Compliance
exports.kycUpdateSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("kyc_update"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        status: zod_1.z.enum(["PENDING", "VERIFIED", "REJECTED", "EXPIRED"]),
        message: zod_1.z.string(),
    }),
});
exports.kycExpiryReminderSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("kyc_expiry_reminder"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        expiryDate: zod_1.z.string().datetime(),
        daysRemaining: zod_1.z.number().int().nonnegative(),
    }),
});
exports.accountClosureSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("account_closure"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        reason: zod_1.z.string(),
        closureDate: zod_1.z.string().datetime(),
    }),
});
// Insurance
exports.policyRenewalSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("policy_renewal"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        policyNumber: zod_1.z.string(),
        premium: zod_1.z.number().positive(),
        dueDate: zod_1.z.string().datetime(),
    }),
});
exports.claimStatusSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("claim_status"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        claimId: zod_1.z.string(),
        status: zod_1.z.enum(["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "SETTLED"]),
        amount: zod_1.z.number().positive().optional(),
    }),
});
exports.premiumDueSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("premium_due"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        policyNumber: zod_1.z.string(),
        premium: zod_1.z.number().positive(),
        dueDate: zod_1.z.string().datetime(),
    }),
});
// Lending
exports.emiReminderSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("emi_reminder"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        loanId: zod_1.z.string(),
        emiAmount: zod_1.z.number().positive(),
        dueDate: zod_1.z.string().datetime(),
    }),
});
exports.loanDisbursementSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("loan_disbursement"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        loanId: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        disbursementDate: zod_1.z.string().datetime(),
    }),
});
exports.creditScoreUpdateSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("credit_score_update"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        score: zod_1.z.number().int().min(300).max(900),
        change: zod_1.z.number(),
        bureau: zod_1.z.enum(["CIBIL", "Experian", "Equifax"]),
    }),
});
// Mutual Funds
exports.sipDebitSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("sip_debit"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        folioNumber: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
        scheme: zod_1.z.string(),
        date: zod_1.z.string().datetime(),
    }),
});
exports.navUpdateSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("nav_update"),
    payload: zod_1.z.object({
        scheme: zod_1.z.string(),
        nav: zod_1.z.number().positive(),
        changePercent: zod_1.z.number(),
        date: zod_1.z.string().datetime(),
    }),
});
// Security
exports.loginAlertSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("login_alert"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        device: zod_1.z.string(),
        location: zod_1.z.string(),
        ip: zod_1.z.string(),
        timestamp: zod_1.z.string().datetime(),
    }),
});
exports.passwordChangeSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("password_change"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        changedAt: zod_1.z.string().datetime(),
        device: zod_1.z.string(),
    }),
});
exports.suspiciousActivitySchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("suspicious_activity"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        activity: zod_1.z.string(),
        riskScore: zod_1.z.number().min(0).max(100),
        details: zod_1.z.string(),
    }),
});
// Regulatory
exports.regulatoryUpdateSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("regulatory_update"),
    payload: zod_1.z.object({
        regulator: zod_1.z.string(),
        updateType: zod_1.z.string(),
        summary: zod_1.z.string(),
        effectiveDate: zod_1.z.string().datetime(),
    }),
});
exports.taxStatementSchema = exports.baseEventSchema.extend({
    type: zod_1.z.literal("tax_statement"),
    payload: zod_1.z.object({
        clientId: zod_1.z.string(),
        fy: zod_1.z.string(),
        statementType: zod_1.z.enum(["AIS", "TIS", "26AS"]),
        availableDate: zod_1.z.string().datetime(),
    }),
});
exports.eventPayloadSchema = zod_1.z.discriminatedUnion("type", [
    exports.marginCallSchema,
    exports.tradeConfirmationSchema,
    exports.orderStatusSchema,
    exports.priceAlertSchema,
    exports.portfolioUpdateSchema,
    exports.dividendCreditSchema,
    exports.corporateActionSchema,
    exports.paymentConfirmationSchema,
    exports.largeTransactionAlertSchema,
    exports.upiCollectRequestSchema,
    exports.kycUpdateSchema,
    exports.kycExpiryReminderSchema,
    exports.accountClosureSchema,
    exports.policyRenewalSchema,
    exports.claimStatusSchema,
    exports.premiumDueSchema,
    exports.emiReminderSchema,
    exports.loanDisbursementSchema,
    exports.creditScoreUpdateSchema,
    exports.sipDebitSchema,
    exports.navUpdateSchema,
    exports.loginAlertSchema,
    exports.passwordChangeSchema,
    exports.suspiciousActivitySchema,
    exports.regulatoryUpdateSchema,
    exports.taxStatementSchema,
]);
/**
 * Validates an unknown input against the full discriminated union of
 * financial event types. Returns a typed EventPayload on success or
 * throws a ZodError with detailed validation messages on failure.
 */
function validateEvent(input) {
    const result = exports.eventPayloadSchema.safeParse(input);
    if (!result.success) {
        throw result.error;
    }
    return result.data;
}
//# sourceMappingURL=schemas.js.map