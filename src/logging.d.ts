/**
 * Structured logging via Pino with automatic redaction of sensitive fields.
 *
 * The logger is configured once and exported as a singleton. All modules
 * should import `getLogger()` instead of using `console.*` directly.
 *
 * Redaction rules strip known PII / credential fields from log output so
 * they never leak into stdout, files, or log aggregators.
 */
import { Logger } from "pino";
/**
 * Returns the configured Pino logger instance.
 *
 * On first call the logger is created with:
 * - `pino-pretty` in development for human-readable output
 * - JSON in production for log aggregators
 * - Automatic redaction of sensitive fields
 */
export declare function getLogger(): Logger;
//# sourceMappingURL=logging.d.ts.map