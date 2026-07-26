"use strict";
/**
 * Structured logging via Pino with automatic redaction of sensitive fields.
 *
 * The logger is configured once and exported as a singleton. All modules
 * should import `getLogger()` instead of using `console.*` directly.
 *
 * Redaction rules strip known PII / credential fields from log output so
 * they never leak into stdout, files, or log aggregators.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = getLogger;
const pino_1 = __importDefault(require("pino"));
// ---------------------------------------------------------------------------
// Redaction paths — field names that should never appear in logs
// ---------------------------------------------------------------------------
const REDACT_PATHS = [
    // Credentials & secrets
    "password",
    "passwd",
    "secret",
    "token",
    "apiKey",
    "api_key",
    "apikey",
    "authorization",
    "accessToken",
    "access_token",
    "refreshToken",
    "refresh_token",
    "privateKey",
    "private_key",
    // PII
    "email",
    "phone",
    "phoneNumber",
    "phone_number",
    "mobile",
    "aadhaar",
    "pan",
    "ssn",
    "dob",
    "dateOfBirth",
    "date_of_birth",
    "address",
    "firstName",
    "first_name",
    "lastName",
    "last_name",
    "fullName",
    "full_name",
    // Financial
    "accountNumber",
    "account_number",
    "creditCard",
    "credit_card",
    "cvv",
    "iban",
    "ifsc",
    "upi",
    // Connection strings (may contain credentials)
    "connectionString",
    "connection_string",
    "url",
    "uri",
    "dsn",
];
// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------
let logger;
/**
 * Returns the configured Pino logger instance.
 *
 * On first call the logger is created with:
 * - `pino-pretty` in development for human-readable output
 * - JSON in production for log aggregators
 * - Automatic redaction of sensitive fields
 */
function getLogger() {
    if (logger) {
        return logger;
    }
    const isDev = process.env.NODE_ENV !== "production";
    logger = (0, pino_1.default)({
        level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
        redact: {
            paths: REDACT_PATHS,
            censor: "[REDACTED]",
        },
        ...(isDev
            ? {
                transport: {
                    target: "pino-pretty",
                    options: {
                        colorize: true,
                        translateTime: "SYS:HH:MM:ss.l",
                        ignore: "pid,hostname",
                    },
                },
            }
            : {}),
    });
    return logger;
}
//# sourceMappingURL=logging.js.map