// ---------------------------------------------------------------------------
// Quiet Hours — timezone-aware quiet period evaluation.
//
// During quiet hours, only non-intrusive channels (EMAIL) are allowed
// unless the event has a quiet-hours bypass (e.g., margin calls).
// ---------------------------------------------------------------------------

/**
 * Checks whether the current time falls within the user's configured
 * quiet hours, adjusted for their timezone.
 *
 * @param userId - The user ID (unused currently; reserved for future per-user timezone lookup)
 * @param timezone - IANA timezone string (e.g. "Asia/Kolkata")
 * @returns true if we are currently in quiet hours
 */
export function isQuietHours(userId: string, timezone: string): boolean {
  // Get current time in the user's timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const currentMinutes = hour * 60 + minute;

  // Default quiet hours: 22:00 - 07:00 (10 PM to 7 AM)
  const quietStartMinutes = 22 * 60; // 22:00
  const quietEndMinutes = 7 * 60;     // 07:00

  // Wraps around midnight
  if (quietStartMinutes < quietEndMinutes) {
    return currentMinutes >= quietStartMinutes && currentMinutes < quietEndMinutes;
  }
  return currentMinutes >= quietStartMinutes || currentMinutes < quietEndMinutes;
}