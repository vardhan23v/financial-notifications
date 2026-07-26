/**
 * DLQ monitor and remediation hooks.
 *
 * alertOnDLQ() inspects the current DLQ and generates alert messages for the
 * operations team. remediate() is an async hook that operations teams can
 * override to plug in automated remediation workflows (e.g. replay, escalate,
 * or notify a human operator).
 */
/**
 * Generates alert messages for every entry currently sitting in the DLQ.
 * Returns an empty array when the DLQ is clean.
 */
export declare function alertOnDLQ(): string[];
/**
 * Default remediation hook. The operations team should replace or wrap this
 * function with their own automated remediation workflow (e.g. replay the
 * event, log to an external system, or page an on-call engineer).
 *
 * The default implementation logs a warning and returns `false` to signal
 * that no automated remediation was performed.
 */
export declare let remediate: (event: object) => Promise<boolean>;
/**
 * Replaces the current remediation hook with a custom implementation.
 * Use this to plug in automated workflows without modifying this module.
 */
export declare function setRemediateHook(hook: (event: object) => Promise<boolean>): void;
//# sourceMappingURL=monitor.d.ts.map