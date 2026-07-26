/**
 * DLQ monitor and remediation hooks.
 *
 * alertOnDLQ() inspects the current DLQ and generates alert messages for the
 * operations team. remediate() is an async hook that operations teams can
 * override to plug in automated remediation workflows (e.g. replay, escalate,
 * or notify a human operator).
 */

import { getDLQ } from "./processor";

/**
 * Generates alert messages for every entry currently sitting in the DLQ.
 * Returns an empty array when the DLQ is clean.
 */
export function alertOnDLQ(): string[] {
  const entries = getDLQ();

  if (entries.length === 0) {
    return [];
  }

  return entries.map((entry, index) => {
    const eventSummary =
      typeof entry.event === "object" && entry.event !== null
        ? JSON.stringify(entry.event)
        : String(entry.event);

    return (
      `[DLQ ALERT #${index + 1}] ` +
      `Error: ${entry.error} | ` +
      `Event: ${eventSummary} | ` +
      `Timestamp: ${new Date(entry.timestamp).toISOString()}`
    );
  });
}

/**
 * Default remediation hook. The operations team should replace or wrap this
 * function with their own automated remediation workflow (e.g. replay the
 * event, log to an external system, or page an on-call engineer).
 *
 * The default implementation logs a warning and returns `false` to signal
 * that no automated remediation was performed.
 */
export let remediate: (event: object) => Promise<boolean> = async (
  event: object,
): Promise<boolean> => {
  console.warn(
    "[DLQ REMEDIATE] No custom remediation hook installed. Event:",
    event,
  );
  return false;
};

/**
 * Replaces the current remediation hook with a custom implementation.
 * Use this to plug in automated workflows without modifying this module.
 */
export function setRemediateHook(
  hook: (event: object) => Promise<boolean>,
): void {
  remediate = hook;
}