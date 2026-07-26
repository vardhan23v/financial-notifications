"use strict";
// ---------------------------------------------------------------------------
// Seed script — populates the database with 1000 users, default preferences,
// notification templates, delivery providers, and regulatory rules.
//
// Usage: npx prisma db seed
// ---------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = seedUsers;
exports.seedPreferences = seedPreferences;
exports.seedTemplates = seedTemplates;
exports.seedProviders = seedProviders;
exports.seedRegulatoryRules = seedRegulatoryRules;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const FIRST_NAMES = [
    "Aarav", "Vihaan", "Vivaan", "Ananya", "Diya", "Advik", "Kabir", "Anaya",
    "Aaradhya", "Reyansh", "Sai", "Arjun", "Ishaan", "Rohan", "Aryan",
    "Sanya", "Tanya", "Kavya", "Jhanvi", "Riya", "Priya", "Neha", "Pooja",
    "Raj", "Amit", "Vikram", "Suresh", "Deepak", "Manish", "Rahul",
    "Sunita", "Geeta", "Meena", "Lata", "Asha", "Nisha", "Kiran", "Anil",
    "Sanjay", "Vijay", "Ajay", "Abhishek", "Nikhil", "Karan", "Varun",
];
const LAST_NAMES = [
    "Sharma", "Patel", "Singh", "Kumar", "Gupta", "Verma", "Reddy", "Nair",
    "Menon", "Iyer", "Joshi", "Desai", "Mehta", "Shah", "Chopra",
    "Malhotra", "Kapoor", "Bhatia", "Saxena", "Rao", "Das", "Sen",
    "Banerjee", "Chatterjee", "Mukherjee", "Thakur", "Yadav", "Pandey",
    "Mishra", "Tiwari", "Dubey", "Chauhan", "Rathore", "Shetty", "Hegde",
];
const DOMAINS = [
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
    "protonmail.com", "icloud.com", "rediffmail.com",
];
const CHANNELS = ["EMAIL", "SMS", "PUSH", "WHATSAPP"];
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generatePhone() {
    // Indian mobile numbers: +91 followed by 10 digits starting with 6-9
    const first = randomInt(6, 9);
    const rest = Array.from({ length: 9 }, () => randomInt(0, 9)).join("");
    return `+91${first}${rest}`;
}
function generatePAN() {
    // PAN format: 5 letters, 4 digits, 1 letter
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randLetters = (n) => Array.from({ length: n }, () => letters[randomInt(0, 25)]).join("");
    const randDigits = (n) => Array.from({ length: n }, () => randomInt(0, 9)).join("");
    return `${randLetters(5)}${randDigits(4)}${randLetters(1)}`;
}
// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------
async function seedUsers(count) {
    console.log(`Seeding ${count} users...`);
    const users = [];
    const seenEmails = new Set();
    const seenPANs = new Set();
    for (let i = 0; i < count; i++) {
        const firstName = pick(FIRST_NAMES);
        const lastName = pick(LAST_NAMES);
        const name = `${firstName} ${lastName}`;
        // Generate unique email
        let email;
        do {
            const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
            const suffix = i > 0 ? `.${randomInt(1, 9999)}` : "";
            email = `${base}${suffix}@${pick(DOMAINS)}`;
        } while (seenEmails.has(email));
        seenEmails.add(email);
        // Generate unique PAN
        let pan;
        do {
            pan = generatePAN();
        } while (seenPANs.has(pan));
        seenPANs.add(pan);
        users.push({
            email,
            phone: generatePhone(),
            name,
            pan,
        });
    }
    // Bulk insert users
    for (const user of users) {
        await prisma.user.create({ data: user });
    }
    console.log(`  ✓ ${count} users created`);
}
async function seedPreferences() {
    console.log("Seeding user preferences...");
    const users = await prisma.user.findMany({ select: { id: true } });
    const preferences = users.map((user) => {
        // Randomly assign 1-4 channels per user
        const numChannels = randomInt(1, 4);
        const shuffled = [...CHANNELS].sort(() => Math.random() - 0.5);
        const userChannels = shuffled.slice(0, numChannels);
        // ~20% of users have quiet hours
        const hasQuietHours = Math.random() < 0.2;
        return {
            userId: user.id,
            channels: userChannels,
            quietHoursStart: hasQuietHours ? "22:00" : null,
            quietHoursEnd: hasQuietHours ? "07:00" : null,
            language: pick(["en-IN", "hi-IN", "gu-IN", "mr-IN", "ta-IN"]),
        };
    });
    for (const pref of preferences) {
        await prisma.userPreferences.create({ data: pref });
    }
    console.log(`  ✓ ${preferences.length} user preferences created`);
}
async function seedTemplates() {
    console.log("Seeding notification templates...");
    const templates = [
        // Margin Call — SEBI-mandated SMS + email
        {
            eventType: "margin_call",
            channel: "SMS",
            subject: "Margin Call Alert",
            body: "Dear {{name}}, your margin shortfall is ₹{{shortfall}}. Please fund your account by {{deadline}} to avoid liquidation. - Pro4",
        },
        {
            eventType: "margin_call",
            channel: "EMAIL",
            subject: "Margin Call Notice — Action Required",
            body: `<h2>Margin Call Notice</h2><p>Dear {{name}},</p><p>Your account has a margin shortfall of <strong>₹{{shortfall}}</strong> as of {{date}}.</p><p>Please deposit the required funds by <strong>{{deadline}}</strong> to avoid position liquidation.</p><p>Regards,<br/>Pro4 Risk Team</p>`,
        },
        // Trade Confirmation
        {
            eventType: "trade_confirmation",
            channel: "EMAIL",
            subject: "Trade Confirmation — {{symbol}}",
            body: `<h2>Trade Confirmation</h2><p>Dear {{name}},</p><p>Your {{action}} order for <strong>{{quantity}} {{symbol}}</strong> at ₹{{price}} has been executed.</p><p>Trade ID: {{tradeId}}</p><p>Regards,<br/>Pro4 Trading Desk</p>`,
        },
        {
            eventType: "trade_confirmation",
            channel: "SMS",
            subject: "Trade Confirmed",
            body: "{{action}} {{quantity}} {{symbol}} @ ₹{{price}} executed. Trade ID: {{tradeId}}",
        },
        {
            eventType: "trade_confirmation",
            channel: "PUSH",
            subject: "Trade Executed",
            body: "{{action}} {{quantity}} {{symbol}} @ ₹{{price}}",
        },
        // Portfolio Update
        {
            eventType: "portfolio_update",
            channel: "EMAIL",
            subject: "Portfolio Update — {{date}}",
            body: `<h2>Portfolio Update</h2><p>Dear {{name}},</p><p>Your portfolio NAV as of {{date}} is <strong>₹{{nav}}</strong>.</p><p>Day change: {{changePercent}}%</p><p>Regards,<br/>Pro4 Wealth</p>`,
        },
        {
            eventType: "portfolio_update",
            channel: "PUSH",
            subject: "Portfolio Update",
            body: "NAV: ₹{{nav}} | {{changePercent}}% today",
        },
        // Payment Confirmation
        {
            eventType: "payment_confirmation",
            channel: "EMAIL",
            subject: "Payment Confirmation — ₹{{amount}}",
            body: `<h2>Payment Confirmation</h2><p>Dear {{name}},</p><p>Your payment of <strong>₹{{amount}}</strong> via {{method}} has been received.</p><p>Transaction ID: {{txnId}}</p><p>Regards,<br/>Pro4 Payments</p>`,
        },
        {
            eventType: "payment_confirmation",
            channel: "SMS",
            subject: "Payment Received",
            body: "₹{{amount}} received via {{method}}. Txn ID: {{txnId}}",
        },
        // KYC Update
        {
            eventType: "kyc_update",
            channel: "EMAIL",
            subject: "KYC Status Update",
            body: `<h2>KYC Status Update</h2><p>Dear {{name}},</p><p>Your KYC status has been updated to <strong>{{status}}</strong>.</p><p>{{message}}</p><p>Regards,<br/>Pro4 Compliance</p>`,
        },
    ];
    for (const template of templates) {
        await prisma.notificationTemplate.create({ data: template });
    }
    console.log(`  ✓ ${templates.length} notification templates created`);
}
async function seedProviders() {
    console.log("Seeding delivery providers...");
    const providers = [
        {
            name: "twilio-sms",
            channel: "SMS",
            priority: 1,
            config: {
                region: "ap-south-1",
                senderId: "PRO4NT",
                maxRetries: 3,
                rateLimitPerSecond: 100,
            },
        },
        {
            name: "msg91-sms",
            channel: "SMS",
            priority: 2,
            config: {
                route: "transactional",
                country: "91",
                maxRetries: 3,
                rateLimitPerSecond: 50,
            },
        },
        {
            name: "sendgrid-email",
            channel: "EMAIL",
            priority: 1,
            config: {
                from: "notifications@pro4.in",
                replyTo: "support@pro4.in",
                maxRetries: 3,
                rateLimitPerSecond: 200,
            },
        },
        {
            name: "firebase-push",
            channel: "PUSH",
            priority: 1,
            config: {
                projectId: "pro4-notifications",
                maxRetries: 3,
                ttl: 86400,
            },
        },
    ];
    for (const provider of providers) {
        await prisma.deliveryProvider.create({ data: provider });
    }
    console.log(`  ✓ ${providers.length} delivery providers created`);
}
async function seedRegulatoryRules() {
    console.log("Seeding regulatory rules...");
    const rules = [
        {
            regulator: "SEBI",
            eventType: "margin_call",
            channel: "SMS",
            priority: 100,
        },
        {
            regulator: "SEBI",
            eventType: "trade_confirmation",
            channel: "EMAIL",
            priority: 90,
        },
        {
            regulator: "RBI",
            eventType: "payment_confirmation",
            channel: "SMS",
            priority: 100,
        },
        {
            regulator: "RBI",
            eventType: "large_transaction_alert",
            channel: "SMS",
            priority: 95,
        },
        {
            regulator: "IRDAI",
            eventType: "policy_renewal",
            channel: "EMAIL",
            priority: 80,
        },
        {
            regulator: "SEBI",
            eventType: "account_closure",
            channel: "EMAIL",
            priority: 85,
        },
    ];
    for (const rule of rules) {
        await prisma.regulatoryRule.create({ data: rule });
    }
    console.log(`  ✓ ${rules.length} regulatory rules created`);
}
// ---------------------------------------------------------------------------
// Main — orchestrates all seed functions
// ---------------------------------------------------------------------------
async function main() {
    console.log("🌱 Starting database seed...\n");
    const start = Date.now();
    // Order matters: users first, then preferences (FK to users)
    await seedUsers(1000);
    await seedPreferences();
    await seedTemplates();
    await seedProviders();
    await seedRegulatoryRules();
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n✅ Seed complete in ${elapsed}s`);
}
main()
    .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
