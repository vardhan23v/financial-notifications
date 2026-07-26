"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreEvent = scoreEvent;
function scoreEvent(event) {
    let riskScore = 0;
    let urgencyScore = 0;
    let quietHoursBypass = false;
    switch (event.type) {
        case "margin_call":
            riskScore = 80;
            urgencyScore = 95;
            quietHoursBypass = true;
            break;
        case "suspicious_activity":
            riskScore = event.payload.riskScore;
            urgencyScore = 90;
            quietHoursBypass = true;
            break;
        case "large_transaction_alert":
            riskScore = 60;
            urgencyScore = 85;
            quietHoursBypass = true;
            break;
        case "login_alert":
            riskScore = 50;
            urgencyScore = 80;
            quietHoursBypass = true;
            break;
        case "password_change":
            riskScore = 40;
            urgencyScore = 75;
            quietHoursBypass = false;
            break;
        case "kyc_expiry_reminder": {
            const days = event.payload.daysRemaining ?? 0;
            riskScore = days <= 7 ? 70 : 30;
            urgencyScore = days <= 7 ? 85 : 50;
            quietHoursBypass = days <= 3;
            break;
        }
        case "emi_reminder": {
            const dueDate = new Date(event.payload.dueDate);
            const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            riskScore = daysUntil <= 3 ? 60 : 20;
            urgencyScore = daysUntil <= 3 ? 80 : 40;
            quietHoursBypass = daysUntil <= 1;
            break;
        }
        case "premium_due": {
            const pDueDate = new Date(event.payload.dueDate);
            const pDaysUntil = Math.ceil((pDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            riskScore = pDaysUntil <= 7 ? 50 : 20;
            urgencyScore = pDaysUntil <= 7 ? 70 : 40;
            quietHoursBypass = pDaysUntil <= 3;
            break;
        }
        case "trade_confirmation":
            riskScore = 10;
            urgencyScore = 60;
            quietHoursBypass = false;
            break;
        case "payment_confirmation":
            riskScore = 10;
            urgencyScore = 70;
            quietHoursBypass = false;
            break;
        default:
            riskScore = 10;
            urgencyScore = 40;
            quietHoursBypass = false;
    }
    const recommendedChannels = resolveRecommendedChannels(riskScore, urgencyScore);
    return {
        riskScore: Math.min(100, Math.max(0, riskScore)),
        urgencyScore: Math.min(100, Math.max(0, urgencyScore)),
        recommendedChannels,
        quietHoursBypass,
    };
}
function resolveRecommendedChannels(riskScore, urgencyScore) {
    if (riskScore >= 70 || urgencyScore >= 80) {
        return ["SMS", "EMAIL", "PUSH"];
    }
    if (riskScore >= 40 || urgencyScore >= 60) {
        return ["EMAIL", "PUSH"];
    }
    return ["EMAIL"];
}
//# sourceMappingURL=scoring.js.map