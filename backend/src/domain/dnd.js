"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDND = checkDND;
const prisma_1 = require("../../../src/infrastructure/prisma");
// ---------------------------------------------------------------------------
// TRAI DND Compliance — checks whether a user has opted out of a channel
// for a given event category, with transactional exemptions.
//
// TRAI (Telecom Regulatory Authority of India) mandates that promotional
// messages respect the DND registry. Transactional messages (e.g., margin
// calls, trade confirmations, payment alerts) are exempt.
// ---------------------------------------------------------------------------
/**
 * Categories that TRAI classifies as transactional and therefore exempt
 * from DND blocking. These are always allowed through regardless of the
 * user's DND registration status.
 */
const TRANSACTIONAL_CATEGORIES = new Set([
    "margin_call",
    "trade_confirmation",
    "order_status",
    "payment_confirmation",
    "large_transaction_alert",
    "login_alert",
    "password_change",
    "suspicious_activity",
    "kyc_update",
    "kyc_expiry_reminder",
    "account_closure",
    "loan_disbursement",
    "sip_debit",
    "upi_collect_request",
    "tax_statement",
    "regulatory_update",
]);
/**
 * Checks whether a notification to the given user on the given channel
 * for the given event category is allowed under TRAI DND rules.
 *
 * @param userId - The recipient user ID
 * @param channel - The delivery channel (SMS, EMAIL, etc.)
 * @param eventCategory - The event type string (e.g. "margin_call")
 * @returns true if the notification is allowed, false if blocked by DND
 */
async function checkDND(userId, channel, eventCategory) {
    // Transactional categories are always allowed (TRAI exemption)
    if (TRANSACTIONAL_CATEGORIES.has(eventCategory)) {
        return true;
    }
    // Only SMS and WHATSAPP are subject to TRAI DND
    if (channel !== "SMS" && channel !== "WHATSAPP") {
        return true;
    }
    const prisma = (0, prisma_1.getPrismaClient)();
    // Look up the user to get their phone number
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { phone: true },
    });
    if (!user?.phone) {
        // No phone on file — allow (can't check DND without a phone)
        return true;
    }
    // Check the DND registry for this phone + channel combination
    const dndEntry = await prisma.dNDRegistry.findFirst({
        where: {
            phone: user.phone,
            channel,
            isActive: true,
        },
    });
    if (!dndEntry) {
        // Not in DND registry — allowed
        return true;
    }
    // Check if this specific category is exempted
    if (dndEntry.exemptCategories.includes(eventCategory)) {
        return true;
    }
    // Blocked by DND
    return false;
}
//# sourceMappingURL=dnd.js.map