import { z } from "zod";
import type { EventPayload } from "./events";
export declare const baseEventSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: string;
    userId: string;
    payload: Record<string, unknown>;
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: string;
    userId: string;
    payload: Record<string, unknown>;
    correlationId?: string | undefined;
}>;
export declare const marginCallSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"margin_call">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        marginShortfall: z.ZodNumber;
        deadline: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        marginShortfall: number;
        deadline: string;
    }, {
        clientId: string;
        marginShortfall: number;
        deadline: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "margin_call";
    userId: string;
    payload: {
        clientId: string;
        marginShortfall: number;
        deadline: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "margin_call";
    userId: string;
    payload: {
        clientId: string;
        marginShortfall: number;
        deadline: string;
    };
    correlationId?: string | undefined;
}>;
export declare const tradeConfirmationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"trade_confirmation">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        tradeId: z.ZodString;
        symbol: z.ZodString;
        action: z.ZodEnum<["BUY", "SELL"]>;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        clientId: string;
        tradeId: string;
        action: "BUY" | "SELL";
        quantity: number;
        price: number;
    }, {
        symbol: string;
        clientId: string;
        tradeId: string;
        action: "BUY" | "SELL";
        quantity: number;
        price: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "trade_confirmation";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        tradeId: string;
        action: "BUY" | "SELL";
        quantity: number;
        price: number;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "trade_confirmation";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        tradeId: string;
        action: "BUY" | "SELL";
        quantity: number;
        price: number;
    };
    correlationId?: string | undefined;
}>;
export declare const orderStatusSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"order_status">;
    payload: z.ZodObject<{
        orderId: z.ZodString;
        status: z.ZodEnum<["PENDING", "EXECUTED", "REJECTED", "CANCELLED"]>;
        symbol: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        orderId: string;
        status: "PENDING" | "EXECUTED" | "REJECTED" | "CANCELLED";
        reason?: string | undefined;
    }, {
        symbol: string;
        orderId: string;
        status: "PENDING" | "EXECUTED" | "REJECTED" | "CANCELLED";
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "order_status";
    userId: string;
    payload: {
        symbol: string;
        orderId: string;
        status: "PENDING" | "EXECUTED" | "REJECTED" | "CANCELLED";
        reason?: string | undefined;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "order_status";
    userId: string;
    payload: {
        symbol: string;
        orderId: string;
        status: "PENDING" | "EXECUTED" | "REJECTED" | "CANCELLED";
        reason?: string | undefined;
    };
    correlationId?: string | undefined;
}>;
export declare const priceAlertSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"price_alert">;
    payload: z.ZodObject<{
        symbol: z.ZodString;
        targetPrice: z.ZodNumber;
        currentPrice: z.ZodNumber;
        alertType: z.ZodEnum<["ABOVE", "BELOW"]>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        targetPrice: number;
        currentPrice: number;
        alertType: "ABOVE" | "BELOW";
    }, {
        symbol: string;
        targetPrice: number;
        currentPrice: number;
        alertType: "ABOVE" | "BELOW";
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "price_alert";
    userId: string;
    payload: {
        symbol: string;
        targetPrice: number;
        currentPrice: number;
        alertType: "ABOVE" | "BELOW";
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "price_alert";
    userId: string;
    payload: {
        symbol: string;
        targetPrice: number;
        currentPrice: number;
        alertType: "ABOVE" | "BELOW";
    };
    correlationId?: string | undefined;
}>;
export declare const portfolioUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"portfolio_update">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        nav: z.ZodNumber;
        changePercent: z.ZodNumber;
        holdings: z.ZodArray<z.ZodObject<{
            symbol: z.ZodString;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            value: number;
        }, {
            symbol: string;
            value: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        nav: number;
        changePercent: number;
        holdings: {
            symbol: string;
            value: number;
        }[];
    }, {
        clientId: string;
        nav: number;
        changePercent: number;
        holdings: {
            symbol: string;
            value: number;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "portfolio_update";
    userId: string;
    payload: {
        clientId: string;
        nav: number;
        changePercent: number;
        holdings: {
            symbol: string;
            value: number;
        }[];
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "portfolio_update";
    userId: string;
    payload: {
        clientId: string;
        nav: number;
        changePercent: number;
        holdings: {
            symbol: string;
            value: number;
        }[];
    };
    correlationId?: string | undefined;
}>;
export declare const dividendCreditSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"dividend_credit">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        symbol: z.ZodString;
        amount: z.ZodNumber;
        exDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        clientId: string;
        amount: number;
        exDate: string;
    }, {
        symbol: string;
        clientId: string;
        amount: number;
        exDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "dividend_credit";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        amount: number;
        exDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "dividend_credit";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        amount: number;
        exDate: string;
    };
    correlationId?: string | undefined;
}>;
export declare const corporateActionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"corporate_action">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        symbol: z.ZodString;
        actionType: z.ZodEnum<["BONUS", "SPLIT", "RIGHTS", "MERGER"]>;
        details: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        clientId: string;
        actionType: "BONUS" | "SPLIT" | "RIGHTS" | "MERGER";
        details: string;
    }, {
        symbol: string;
        clientId: string;
        actionType: "BONUS" | "SPLIT" | "RIGHTS" | "MERGER";
        details: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "corporate_action";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        actionType: "BONUS" | "SPLIT" | "RIGHTS" | "MERGER";
        details: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "corporate_action";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        actionType: "BONUS" | "SPLIT" | "RIGHTS" | "MERGER";
        details: string;
    };
    correlationId?: string | undefined;
}>;
export declare const paymentConfirmationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"payment_confirmation">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        amount: z.ZodNumber;
        method: z.ZodEnum<["UPI", "NEFT", "RTGS", "IMPS"]>;
        txnId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        method: "UPI" | "NEFT" | "RTGS" | "IMPS";
        txnId: string;
    }, {
        clientId: string;
        amount: number;
        method: "UPI" | "NEFT" | "RTGS" | "IMPS";
        txnId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "payment_confirmation";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        method: "UPI" | "NEFT" | "RTGS" | "IMPS";
        txnId: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "payment_confirmation";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        method: "UPI" | "NEFT" | "RTGS" | "IMPS";
        txnId: string;
    };
    correlationId?: string | undefined;
}>;
export declare const largeTransactionAlertSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"large_transaction_alert">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        amount: z.ZodNumber;
        txnType: z.ZodEnum<["DEBIT", "CREDIT"]>;
        accountNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        txnType: "DEBIT" | "CREDIT";
        accountNumber: string;
    }, {
        clientId: string;
        amount: number;
        txnType: "DEBIT" | "CREDIT";
        accountNumber: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "large_transaction_alert";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        txnType: "DEBIT" | "CREDIT";
        accountNumber: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "large_transaction_alert";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        txnType: "DEBIT" | "CREDIT";
        accountNumber: string;
    };
    correlationId?: string | undefined;
}>;
export declare const upiCollectRequestSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"upi_collect_request">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        amount: z.ZodNumber;
        merchantName: z.ZodString;
        vpa: z.ZodString;
        expiry: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        merchantName: string;
        vpa: string;
        expiry: string;
    }, {
        clientId: string;
        amount: number;
        merchantName: string;
        vpa: string;
        expiry: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "upi_collect_request";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        merchantName: string;
        vpa: string;
        expiry: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "upi_collect_request";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        merchantName: string;
        vpa: string;
        expiry: string;
    };
    correlationId?: string | undefined;
}>;
export declare const kycUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"kyc_update">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        status: z.ZodEnum<["PENDING", "VERIFIED", "REJECTED", "EXPIRED"]>;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        status: "PENDING" | "REJECTED" | "VERIFIED" | "EXPIRED";
        message: string;
    }, {
        clientId: string;
        status: "PENDING" | "REJECTED" | "VERIFIED" | "EXPIRED";
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "kyc_update";
    userId: string;
    payload: {
        clientId: string;
        status: "PENDING" | "REJECTED" | "VERIFIED" | "EXPIRED";
        message: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "kyc_update";
    userId: string;
    payload: {
        clientId: string;
        status: "PENDING" | "REJECTED" | "VERIFIED" | "EXPIRED";
        message: string;
    };
    correlationId?: string | undefined;
}>;
export declare const kycExpiryReminderSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"kyc_expiry_reminder">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        expiryDate: z.ZodString;
        daysRemaining: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        expiryDate: string;
        daysRemaining: number;
    }, {
        clientId: string;
        expiryDate: string;
        daysRemaining: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "kyc_expiry_reminder";
    userId: string;
    payload: {
        clientId: string;
        expiryDate: string;
        daysRemaining: number;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "kyc_expiry_reminder";
    userId: string;
    payload: {
        clientId: string;
        expiryDate: string;
        daysRemaining: number;
    };
    correlationId?: string | undefined;
}>;
export declare const accountClosureSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"account_closure">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        reason: z.ZodString;
        closureDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        reason: string;
        closureDate: string;
    }, {
        clientId: string;
        reason: string;
        closureDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "account_closure";
    userId: string;
    payload: {
        clientId: string;
        reason: string;
        closureDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "account_closure";
    userId: string;
    payload: {
        clientId: string;
        reason: string;
        closureDate: string;
    };
    correlationId?: string | undefined;
}>;
export declare const policyRenewalSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"policy_renewal">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        policyNumber: z.ZodString;
        premium: z.ZodNumber;
        dueDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    }, {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "policy_renewal";
    userId: string;
    payload: {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "policy_renewal";
    userId: string;
    payload: {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    };
    correlationId?: string | undefined;
}>;
export declare const claimStatusSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"claim_status">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        claimId: z.ZodString;
        status: z.ZodEnum<["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "SETTLED"]>;
        amount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        status: "REJECTED" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "SETTLED";
        claimId: string;
        amount?: number | undefined;
    }, {
        clientId: string;
        status: "REJECTED" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "SETTLED";
        claimId: string;
        amount?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "claim_status";
    userId: string;
    payload: {
        clientId: string;
        status: "REJECTED" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "SETTLED";
        claimId: string;
        amount?: number | undefined;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "claim_status";
    userId: string;
    payload: {
        clientId: string;
        status: "REJECTED" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "SETTLED";
        claimId: string;
        amount?: number | undefined;
    };
    correlationId?: string | undefined;
}>;
export declare const premiumDueSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"premium_due">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        policyNumber: z.ZodString;
        premium: z.ZodNumber;
        dueDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    }, {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "premium_due";
    userId: string;
    payload: {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "premium_due";
    userId: string;
    payload: {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    };
    correlationId?: string | undefined;
}>;
export declare const emiReminderSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"emi_reminder">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        loanId: z.ZodString;
        emiAmount: z.ZodNumber;
        dueDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        dueDate: string;
        loanId: string;
        emiAmount: number;
    }, {
        clientId: string;
        dueDate: string;
        loanId: string;
        emiAmount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "emi_reminder";
    userId: string;
    payload: {
        clientId: string;
        dueDate: string;
        loanId: string;
        emiAmount: number;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "emi_reminder";
    userId: string;
    payload: {
        clientId: string;
        dueDate: string;
        loanId: string;
        emiAmount: number;
    };
    correlationId?: string | undefined;
}>;
export declare const loanDisbursementSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"loan_disbursement">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        loanId: z.ZodString;
        amount: z.ZodNumber;
        disbursementDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        loanId: string;
        disbursementDate: string;
    }, {
        clientId: string;
        amount: number;
        loanId: string;
        disbursementDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "loan_disbursement";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        loanId: string;
        disbursementDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "loan_disbursement";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        loanId: string;
        disbursementDate: string;
    };
    correlationId?: string | undefined;
}>;
export declare const creditScoreUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"credit_score_update">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        score: z.ZodNumber;
        change: z.ZodNumber;
        bureau: z.ZodEnum<["CIBIL", "Experian", "Equifax"]>;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        score: number;
        change: number;
        bureau: "CIBIL" | "Experian" | "Equifax";
    }, {
        clientId: string;
        score: number;
        change: number;
        bureau: "CIBIL" | "Experian" | "Equifax";
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "credit_score_update";
    userId: string;
    payload: {
        clientId: string;
        score: number;
        change: number;
        bureau: "CIBIL" | "Experian" | "Equifax";
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "credit_score_update";
    userId: string;
    payload: {
        clientId: string;
        score: number;
        change: number;
        bureau: "CIBIL" | "Experian" | "Equifax";
    };
    correlationId?: string | undefined;
}>;
export declare const sipDebitSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"sip_debit">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        folioNumber: z.ZodString;
        amount: z.ZodNumber;
        scheme: z.ZodString;
        date: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        folioNumber: string;
        scheme: string;
        date: string;
    }, {
        clientId: string;
        amount: number;
        folioNumber: string;
        scheme: string;
        date: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "sip_debit";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        folioNumber: string;
        scheme: string;
        date: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "sip_debit";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        folioNumber: string;
        scheme: string;
        date: string;
    };
    correlationId?: string | undefined;
}>;
export declare const navUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"nav_update">;
    payload: z.ZodObject<{
        scheme: z.ZodString;
        nav: z.ZodNumber;
        changePercent: z.ZodNumber;
        date: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        nav: number;
        changePercent: number;
        scheme: string;
        date: string;
    }, {
        nav: number;
        changePercent: number;
        scheme: string;
        date: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "nav_update";
    userId: string;
    payload: {
        nav: number;
        changePercent: number;
        scheme: string;
        date: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "nav_update";
    userId: string;
    payload: {
        nav: number;
        changePercent: number;
        scheme: string;
        date: string;
    };
    correlationId?: string | undefined;
}>;
export declare const loginAlertSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"login_alert">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        device: z.ZodString;
        location: z.ZodString;
        ip: z.ZodString;
        timestamp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        device: string;
        location: string;
        ip: string;
        timestamp: string;
    }, {
        clientId: string;
        device: string;
        location: string;
        ip: string;
        timestamp: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "login_alert";
    userId: string;
    payload: {
        clientId: string;
        device: string;
        location: string;
        ip: string;
        timestamp: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "login_alert";
    userId: string;
    payload: {
        clientId: string;
        device: string;
        location: string;
        ip: string;
        timestamp: string;
    };
    correlationId?: string | undefined;
}>;
export declare const passwordChangeSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"password_change">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        changedAt: z.ZodString;
        device: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        device: string;
        changedAt: string;
    }, {
        clientId: string;
        device: string;
        changedAt: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "password_change";
    userId: string;
    payload: {
        clientId: string;
        device: string;
        changedAt: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "password_change";
    userId: string;
    payload: {
        clientId: string;
        device: string;
        changedAt: string;
    };
    correlationId?: string | undefined;
}>;
export declare const suspiciousActivitySchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"suspicious_activity">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        activity: z.ZodString;
        riskScore: z.ZodNumber;
        details: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        details: string;
        activity: string;
        riskScore: number;
    }, {
        clientId: string;
        details: string;
        activity: string;
        riskScore: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "suspicious_activity";
    userId: string;
    payload: {
        clientId: string;
        details: string;
        activity: string;
        riskScore: number;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "suspicious_activity";
    userId: string;
    payload: {
        clientId: string;
        details: string;
        activity: string;
        riskScore: number;
    };
    correlationId?: string | undefined;
}>;
export declare const regulatoryUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"regulatory_update">;
    payload: z.ZodObject<{
        regulator: z.ZodString;
        updateType: z.ZodString;
        summary: z.ZodString;
        effectiveDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        regulator: string;
        updateType: string;
        summary: string;
        effectiveDate: string;
    }, {
        regulator: string;
        updateType: string;
        summary: string;
        effectiveDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "regulatory_update";
    userId: string;
    payload: {
        regulator: string;
        updateType: string;
        summary: string;
        effectiveDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "regulatory_update";
    userId: string;
    payload: {
        regulator: string;
        updateType: string;
        summary: string;
        effectiveDate: string;
    };
    correlationId?: string | undefined;
}>;
export declare const taxStatementSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"tax_statement">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        fy: z.ZodString;
        statementType: z.ZodEnum<["AIS", "TIS", "26AS"]>;
        availableDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        fy: string;
        statementType: "AIS" | "TIS" | "26AS";
        availableDate: string;
    }, {
        clientId: string;
        fy: string;
        statementType: "AIS" | "TIS" | "26AS";
        availableDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "tax_statement";
    userId: string;
    payload: {
        clientId: string;
        fy: string;
        statementType: "AIS" | "TIS" | "26AS";
        availableDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "tax_statement";
    userId: string;
    payload: {
        clientId: string;
        fy: string;
        statementType: "AIS" | "TIS" | "26AS";
        availableDate: string;
    };
    correlationId?: string | undefined;
}>;
export declare const eventPayloadSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"margin_call">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        marginShortfall: z.ZodNumber;
        deadline: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        marginShortfall: number;
        deadline: string;
    }, {
        clientId: string;
        marginShortfall: number;
        deadline: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "margin_call";
    userId: string;
    payload: {
        clientId: string;
        marginShortfall: number;
        deadline: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "margin_call";
    userId: string;
    payload: {
        clientId: string;
        marginShortfall: number;
        deadline: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"trade_confirmation">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        tradeId: z.ZodString;
        symbol: z.ZodString;
        action: z.ZodEnum<["BUY", "SELL"]>;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        clientId: string;
        tradeId: string;
        action: "BUY" | "SELL";
        quantity: number;
        price: number;
    }, {
        symbol: string;
        clientId: string;
        tradeId: string;
        action: "BUY" | "SELL";
        quantity: number;
        price: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "trade_confirmation";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        tradeId: string;
        action: "BUY" | "SELL";
        quantity: number;
        price: number;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "trade_confirmation";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        tradeId: string;
        action: "BUY" | "SELL";
        quantity: number;
        price: number;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"order_status">;
    payload: z.ZodObject<{
        orderId: z.ZodString;
        status: z.ZodEnum<["PENDING", "EXECUTED", "REJECTED", "CANCELLED"]>;
        symbol: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        orderId: string;
        status: "PENDING" | "EXECUTED" | "REJECTED" | "CANCELLED";
        reason?: string | undefined;
    }, {
        symbol: string;
        orderId: string;
        status: "PENDING" | "EXECUTED" | "REJECTED" | "CANCELLED";
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "order_status";
    userId: string;
    payload: {
        symbol: string;
        orderId: string;
        status: "PENDING" | "EXECUTED" | "REJECTED" | "CANCELLED";
        reason?: string | undefined;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "order_status";
    userId: string;
    payload: {
        symbol: string;
        orderId: string;
        status: "PENDING" | "EXECUTED" | "REJECTED" | "CANCELLED";
        reason?: string | undefined;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"price_alert">;
    payload: z.ZodObject<{
        symbol: z.ZodString;
        targetPrice: z.ZodNumber;
        currentPrice: z.ZodNumber;
        alertType: z.ZodEnum<["ABOVE", "BELOW"]>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        targetPrice: number;
        currentPrice: number;
        alertType: "ABOVE" | "BELOW";
    }, {
        symbol: string;
        targetPrice: number;
        currentPrice: number;
        alertType: "ABOVE" | "BELOW";
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "price_alert";
    userId: string;
    payload: {
        symbol: string;
        targetPrice: number;
        currentPrice: number;
        alertType: "ABOVE" | "BELOW";
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "price_alert";
    userId: string;
    payload: {
        symbol: string;
        targetPrice: number;
        currentPrice: number;
        alertType: "ABOVE" | "BELOW";
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"portfolio_update">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        nav: z.ZodNumber;
        changePercent: z.ZodNumber;
        holdings: z.ZodArray<z.ZodObject<{
            symbol: z.ZodString;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            value: number;
        }, {
            symbol: string;
            value: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        nav: number;
        changePercent: number;
        holdings: {
            symbol: string;
            value: number;
        }[];
    }, {
        clientId: string;
        nav: number;
        changePercent: number;
        holdings: {
            symbol: string;
            value: number;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "portfolio_update";
    userId: string;
    payload: {
        clientId: string;
        nav: number;
        changePercent: number;
        holdings: {
            symbol: string;
            value: number;
        }[];
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "portfolio_update";
    userId: string;
    payload: {
        clientId: string;
        nav: number;
        changePercent: number;
        holdings: {
            symbol: string;
            value: number;
        }[];
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"dividend_credit">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        symbol: z.ZodString;
        amount: z.ZodNumber;
        exDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        clientId: string;
        amount: number;
        exDate: string;
    }, {
        symbol: string;
        clientId: string;
        amount: number;
        exDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "dividend_credit";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        amount: number;
        exDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "dividend_credit";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        amount: number;
        exDate: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"corporate_action">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        symbol: z.ZodString;
        actionType: z.ZodEnum<["BONUS", "SPLIT", "RIGHTS", "MERGER"]>;
        details: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        clientId: string;
        actionType: "BONUS" | "SPLIT" | "RIGHTS" | "MERGER";
        details: string;
    }, {
        symbol: string;
        clientId: string;
        actionType: "BONUS" | "SPLIT" | "RIGHTS" | "MERGER";
        details: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "corporate_action";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        actionType: "BONUS" | "SPLIT" | "RIGHTS" | "MERGER";
        details: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "corporate_action";
    userId: string;
    payload: {
        symbol: string;
        clientId: string;
        actionType: "BONUS" | "SPLIT" | "RIGHTS" | "MERGER";
        details: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"payment_confirmation">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        amount: z.ZodNumber;
        method: z.ZodEnum<["UPI", "NEFT", "RTGS", "IMPS"]>;
        txnId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        method: "UPI" | "NEFT" | "RTGS" | "IMPS";
        txnId: string;
    }, {
        clientId: string;
        amount: number;
        method: "UPI" | "NEFT" | "RTGS" | "IMPS";
        txnId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "payment_confirmation";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        method: "UPI" | "NEFT" | "RTGS" | "IMPS";
        txnId: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "payment_confirmation";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        method: "UPI" | "NEFT" | "RTGS" | "IMPS";
        txnId: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"large_transaction_alert">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        amount: z.ZodNumber;
        txnType: z.ZodEnum<["DEBIT", "CREDIT"]>;
        accountNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        txnType: "DEBIT" | "CREDIT";
        accountNumber: string;
    }, {
        clientId: string;
        amount: number;
        txnType: "DEBIT" | "CREDIT";
        accountNumber: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "large_transaction_alert";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        txnType: "DEBIT" | "CREDIT";
        accountNumber: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "large_transaction_alert";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        txnType: "DEBIT" | "CREDIT";
        accountNumber: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"upi_collect_request">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        amount: z.ZodNumber;
        merchantName: z.ZodString;
        vpa: z.ZodString;
        expiry: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        merchantName: string;
        vpa: string;
        expiry: string;
    }, {
        clientId: string;
        amount: number;
        merchantName: string;
        vpa: string;
        expiry: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "upi_collect_request";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        merchantName: string;
        vpa: string;
        expiry: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "upi_collect_request";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        merchantName: string;
        vpa: string;
        expiry: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"kyc_update">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        status: z.ZodEnum<["PENDING", "VERIFIED", "REJECTED", "EXPIRED"]>;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        status: "PENDING" | "REJECTED" | "VERIFIED" | "EXPIRED";
        message: string;
    }, {
        clientId: string;
        status: "PENDING" | "REJECTED" | "VERIFIED" | "EXPIRED";
        message: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "kyc_update";
    userId: string;
    payload: {
        clientId: string;
        status: "PENDING" | "REJECTED" | "VERIFIED" | "EXPIRED";
        message: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "kyc_update";
    userId: string;
    payload: {
        clientId: string;
        status: "PENDING" | "REJECTED" | "VERIFIED" | "EXPIRED";
        message: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"kyc_expiry_reminder">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        expiryDate: z.ZodString;
        daysRemaining: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        expiryDate: string;
        daysRemaining: number;
    }, {
        clientId: string;
        expiryDate: string;
        daysRemaining: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "kyc_expiry_reminder";
    userId: string;
    payload: {
        clientId: string;
        expiryDate: string;
        daysRemaining: number;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "kyc_expiry_reminder";
    userId: string;
    payload: {
        clientId: string;
        expiryDate: string;
        daysRemaining: number;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"account_closure">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        reason: z.ZodString;
        closureDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        reason: string;
        closureDate: string;
    }, {
        clientId: string;
        reason: string;
        closureDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "account_closure";
    userId: string;
    payload: {
        clientId: string;
        reason: string;
        closureDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "account_closure";
    userId: string;
    payload: {
        clientId: string;
        reason: string;
        closureDate: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"policy_renewal">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        policyNumber: z.ZodString;
        premium: z.ZodNumber;
        dueDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    }, {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "policy_renewal";
    userId: string;
    payload: {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "policy_renewal";
    userId: string;
    payload: {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"claim_status">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        claimId: z.ZodString;
        status: z.ZodEnum<["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "SETTLED"]>;
        amount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        status: "REJECTED" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "SETTLED";
        claimId: string;
        amount?: number | undefined;
    }, {
        clientId: string;
        status: "REJECTED" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "SETTLED";
        claimId: string;
        amount?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "claim_status";
    userId: string;
    payload: {
        clientId: string;
        status: "REJECTED" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "SETTLED";
        claimId: string;
        amount?: number | undefined;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "claim_status";
    userId: string;
    payload: {
        clientId: string;
        status: "REJECTED" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "SETTLED";
        claimId: string;
        amount?: number | undefined;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"premium_due">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        policyNumber: z.ZodString;
        premium: z.ZodNumber;
        dueDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    }, {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "premium_due";
    userId: string;
    payload: {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "premium_due";
    userId: string;
    payload: {
        clientId: string;
        policyNumber: string;
        premium: number;
        dueDate: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"emi_reminder">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        loanId: z.ZodString;
        emiAmount: z.ZodNumber;
        dueDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        dueDate: string;
        loanId: string;
        emiAmount: number;
    }, {
        clientId: string;
        dueDate: string;
        loanId: string;
        emiAmount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "emi_reminder";
    userId: string;
    payload: {
        clientId: string;
        dueDate: string;
        loanId: string;
        emiAmount: number;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "emi_reminder";
    userId: string;
    payload: {
        clientId: string;
        dueDate: string;
        loanId: string;
        emiAmount: number;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"loan_disbursement">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        loanId: z.ZodString;
        amount: z.ZodNumber;
        disbursementDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        loanId: string;
        disbursementDate: string;
    }, {
        clientId: string;
        amount: number;
        loanId: string;
        disbursementDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "loan_disbursement";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        loanId: string;
        disbursementDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "loan_disbursement";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        loanId: string;
        disbursementDate: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"credit_score_update">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        score: z.ZodNumber;
        change: z.ZodNumber;
        bureau: z.ZodEnum<["CIBIL", "Experian", "Equifax"]>;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        score: number;
        change: number;
        bureau: "CIBIL" | "Experian" | "Equifax";
    }, {
        clientId: string;
        score: number;
        change: number;
        bureau: "CIBIL" | "Experian" | "Equifax";
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "credit_score_update";
    userId: string;
    payload: {
        clientId: string;
        score: number;
        change: number;
        bureau: "CIBIL" | "Experian" | "Equifax";
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "credit_score_update";
    userId: string;
    payload: {
        clientId: string;
        score: number;
        change: number;
        bureau: "CIBIL" | "Experian" | "Equifax";
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"sip_debit">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        folioNumber: z.ZodString;
        amount: z.ZodNumber;
        scheme: z.ZodString;
        date: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        amount: number;
        folioNumber: string;
        scheme: string;
        date: string;
    }, {
        clientId: string;
        amount: number;
        folioNumber: string;
        scheme: string;
        date: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "sip_debit";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        folioNumber: string;
        scheme: string;
        date: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "sip_debit";
    userId: string;
    payload: {
        clientId: string;
        amount: number;
        folioNumber: string;
        scheme: string;
        date: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"nav_update">;
    payload: z.ZodObject<{
        scheme: z.ZodString;
        nav: z.ZodNumber;
        changePercent: z.ZodNumber;
        date: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        nav: number;
        changePercent: number;
        scheme: string;
        date: string;
    }, {
        nav: number;
        changePercent: number;
        scheme: string;
        date: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "nav_update";
    userId: string;
    payload: {
        nav: number;
        changePercent: number;
        scheme: string;
        date: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "nav_update";
    userId: string;
    payload: {
        nav: number;
        changePercent: number;
        scheme: string;
        date: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"login_alert">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        device: z.ZodString;
        location: z.ZodString;
        ip: z.ZodString;
        timestamp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        device: string;
        location: string;
        ip: string;
        timestamp: string;
    }, {
        clientId: string;
        device: string;
        location: string;
        ip: string;
        timestamp: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "login_alert";
    userId: string;
    payload: {
        clientId: string;
        device: string;
        location: string;
        ip: string;
        timestamp: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "login_alert";
    userId: string;
    payload: {
        clientId: string;
        device: string;
        location: string;
        ip: string;
        timestamp: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"password_change">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        changedAt: z.ZodString;
        device: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        device: string;
        changedAt: string;
    }, {
        clientId: string;
        device: string;
        changedAt: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "password_change";
    userId: string;
    payload: {
        clientId: string;
        device: string;
        changedAt: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "password_change";
    userId: string;
    payload: {
        clientId: string;
        device: string;
        changedAt: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"suspicious_activity">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        activity: z.ZodString;
        riskScore: z.ZodNumber;
        details: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        details: string;
        activity: string;
        riskScore: number;
    }, {
        clientId: string;
        details: string;
        activity: string;
        riskScore: number;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "suspicious_activity";
    userId: string;
    payload: {
        clientId: string;
        details: string;
        activity: string;
        riskScore: number;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "suspicious_activity";
    userId: string;
    payload: {
        clientId: string;
        details: string;
        activity: string;
        riskScore: number;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"regulatory_update">;
    payload: z.ZodObject<{
        regulator: z.ZodString;
        updateType: z.ZodString;
        summary: z.ZodString;
        effectiveDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        regulator: string;
        updateType: string;
        summary: string;
        effectiveDate: string;
    }, {
        regulator: string;
        updateType: string;
        summary: string;
        effectiveDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "regulatory_update";
    userId: string;
    payload: {
        regulator: string;
        updateType: string;
        summary: string;
        effectiveDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "regulatory_update";
    userId: string;
    payload: {
        regulator: string;
        updateType: string;
        summary: string;
        effectiveDate: string;
    };
    correlationId?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    timestamp: z.ZodString;
    correlationId: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"tax_statement">;
    payload: z.ZodObject<{
        clientId: z.ZodString;
        fy: z.ZodString;
        statementType: z.ZodEnum<["AIS", "TIS", "26AS"]>;
        availableDate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clientId: string;
        fy: string;
        statementType: "AIS" | "TIS" | "26AS";
        availableDate: string;
    }, {
        clientId: string;
        fy: string;
        statementType: "AIS" | "TIS" | "26AS";
        availableDate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    id: string;
    type: "tax_statement";
    userId: string;
    payload: {
        clientId: string;
        fy: string;
        statementType: "AIS" | "TIS" | "26AS";
        availableDate: string;
    };
    correlationId?: string | undefined;
}, {
    timestamp: string;
    id: string;
    type: "tax_statement";
    userId: string;
    payload: {
        clientId: string;
        fy: string;
        statementType: "AIS" | "TIS" | "26AS";
        availableDate: string;
    };
    correlationId?: string | undefined;
}>]>;
export type ValidatedEvent = z.infer<typeof eventPayloadSchema>;
/**
 * Validates an unknown input against the full discriminated union of
 * financial event types. Returns a typed EventPayload on success or
 * throws a ZodError with detailed validation messages on failure.
 */
export declare function validateEvent(input: unknown): EventPayload;
//# sourceMappingURL=schemas.d.ts.map