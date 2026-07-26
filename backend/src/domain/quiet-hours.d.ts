/**
 * Checks whether the current time falls within the user's configured
 * quiet hours, adjusted for their timezone.
 *
 * @param userId - The user ID (unused currently; reserved for future per-user timezone lookup)
 * @param timezone - IANA timezone string (e.g. "Asia/Kolkata")
 * @returns true if we are currently in quiet hours
 */
export declare function isQuietHours(userId: string, timezone: string): boolean;
//# sourceMappingURL=quiet-hours.d.ts.map