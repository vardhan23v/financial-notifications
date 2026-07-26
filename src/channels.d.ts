/**
 * Resolves the notification channels for a given event, considering
 * regulatory requirements, user preferences, TRAI DND compliance,
 * frequency capping, and quiet hours.
 *
 * If the event carries a regulatory channel mandate (e.g., SEBI requires
 * SMS for margin calls), that channel is always returned regardless of
 * the user's configured preferences.
 */
export declare function resolveChannels(event: Record<string, unknown>, preferences: Record<string, unknown>): Promise<string[]>;
//# sourceMappingURL=channels.d.ts.map