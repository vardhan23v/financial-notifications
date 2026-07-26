// ---------------------------------------------------------------------------
// Seed script — populates the database with 1000 users, default preferences,
// notification templates, delivery providers, and regulatory rules.
//
// Usage: npx prisma db seed
// ---------------------------------------------------------------------------

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

const CHANNELS = ["EMAIL", "SMS", "PUSH", "WHATSAPP", "IN_APP"] as const;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhone(): string {
  // Indian mobile numbers: +91 followed by 10 digits starting with 6-9
  const first = randomInt(6, 9);
  const rest = Array.from({ length: 9 }, () => randomInt(0, 9)).join("");
  return `+91${first}${rest}`;
}

function generatePAN(): string {
  // PAN format: 5 letters, 4 digits, 1 letter
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randLetters = (n: number) =>
    Array.from({ length: n }, () => letters[randomInt(0, 25)]).join("");
  const randDigits = (n: number) =>
    Array.from({ length: n }, () => randomInt(0, 9)).join("");
  return `${randLetters(5)}${randDigits(4)}${randLetters(1)}`;
}

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

export async function seedUsers(count: number): Promise<void> {
  console.log(`Seeding ${count} users...`);

  const users: Array<{
    email: string;
    phone: string;
    name: string;
    pan: string;
  }> = [];

  const seenEmails = new Set<string>();
  const seenPANs = new Set<string>();

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const name = `${firstName} ${lastName}`;

    // Generate unique email
    let email: string;
    do {
      const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      const suffix = i > 0 ? `.${randomInt(1, 9999)}` : "";
      email = `${base}${suffix}@${pick(DOMAINS)}`;
    } while (seenEmails.has(email));
    seenEmails.add(email);

    // Generate unique PAN
    let pan: string;
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

export async function seedPreferences(): Promise<void> {
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

export async function seedTemplates(): Promise<void> {
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

export async function seedProviders(): Promise<void> {
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

export async function seedTemplateLocales(): Promise<void> {
  console.log("Seeding template locales...");

  // Fetch all templates to attach locale variants
  const templates = await prisma.notificationTemplate.findMany();

  const locales: Array<{
    templateId: string;
    locale: string;
    subject: string;
    body: string;
  }> = [];

  for (const tpl of templates) {
    // Hindi (hi-IN) locale for margin_call SMS
    if (tpl.eventType === "margin_call" && tpl.channel === "SMS") {
      locales.push({
        templateId: tpl.id,
        locale: "hi-IN",
        subject: "मार्जिन कॉल अलर्ट",
        body: "प्रिय {{name}}, आपकी मार्जिन की कमी ₹{{shortfall}} है। कृपया {{deadline}} तक अपने खाते में धनराशि जमा करें। - Pro4",
      });
    }

    // Hindi locale for margin_call EMAIL
    if (tpl.eventType === "margin_call" && tpl.channel === "EMAIL") {
      locales.push({
        templateId: tpl.id,
        locale: "hi-IN",
        subject: "मार्जिन कॉल सूचना — कार्रवाई आवश्यक",
        body: `<h2>मार्जिन कॉल सूचना</h2><p>प्रिय {{name}},</p><p>आपके खाते में <strong>₹{{shortfall}}</strong> की मार्जिन कमी है (दिनांक: {{date}})।</p><p>कृपया <strong>{{deadline}}</strong> तक आवश्यक धनराशि जमा करें।</p><p>सादर,<br/>Pro4 रिस्क टीम</p>`,
      });
    }

    // Hindi locale for trade_confirmation SMS
    if (tpl.eventType === "trade_confirmation" && tpl.channel === "SMS") {
      locales.push({
        templateId: tpl.id,
        locale: "hi-IN",
        subject: "ट्रेड पुष्टि",
        body: "{{action}} {{quantity}} {{symbol}} @ ₹{{price}} निष्पादित। ट्रेड ID: {{tradeId}}",
      });
    }

    // Hindi locale for trade_confirmation EMAIL
    if (tpl.eventType === "trade_confirmation" && tpl.channel === "EMAIL") {
      locales.push({
        templateId: tpl.id,
        locale: "hi-IN",
        subject: "ट्रेड पुष्टि — {{symbol}}",
        body: `<h2>ट्रेड पुष्टि</h2><p>प्रिय {{name}},</p><p>आपका {{action}} ऑर्डर <strong>{{quantity}} {{symbol}}</strong> ₹{{price}} पर निष्पादित हो गया है।</p><p>ट्रेड ID: {{tradeId}}</p><p>सादर,<br/>Pro4 ट्रेडिंग डेस्क</p>`,
      });
    }

    // Gujarati locale for payment_confirmation SMS
    if (tpl.eventType === "payment_confirmation" && tpl.channel === "SMS") {
      locales.push({
        templateId: tpl.id,
        locale: "gu-IN",
        subject: "ચુકવણી પ્રાપ્ત",
        body: "₹{{amount}} {{method}} દ્વારા પ્રાપ્ત. ટ્રાન્ઝેક્શન ID: {{txnId}}",
      });
    }

    // Tamil locale for kyc_update EMAIL
    if (tpl.eventType === "kyc_update" && tpl.channel === "EMAIL") {
      locales.push({
        templateId: tpl.id,
        locale: "ta-IN",
        subject: "KYC நிலை புதுப்பிப்பு",
        body: `<h2>KYC நிலை புதுப்பிப்பு</h2><p>அன்புள்ள {{name}},</p><p>உங்கள் KYC நிலை <strong>{{status}}</strong> என புதுப்பிக்கப்பட்டுள்ளது.</p><p>{{message}}</p><p>வணக்கம்,<br/>Pro4 இணக்கப்பிரிவு</p>`,
      });
    }
  }

  for (const loc of locales) {
    await prisma.templateLocale.create({ data: loc });
  }

  console.log(`  ✓ ${locales.length} template locales created`);
}

export async function seedRegulatoryRules(): Promise<void> {
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

async function main(): Promise<void> {
  console.log("🌱 Starting database seed...\n");

  const start = Date.now();

  // Order matters: users first, then preferences (FK to users)
  await seedUsers(1000);
  await seedPreferences();
  await seedTemplates();
  await seedTemplateLocales();
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