/**
 * Checks whether a notification to the given user on the given channel
 * would exceed the configured frequency cap.
 *
 * Counts the number of successful deliveries to this user on this channel
 * within the last `windowHours` hours. If the count is at or above
 * `maxCount`, the cap is hit and the notification should be suppressed.
 *
 * @param userId - The recipient user ID
 * @param channel - The delivery channel
 * @param windowHours - The sliding window size in hours
 * @param maxCount - Maximum allowed deliveries within the window
 * @returns true if the notification is allowed, false if the cap is exceeded
 */
export declare function checkFrequencyCap(userId: string, channel: string, windowHours: number, maxCount: number): Promise<boolean>;
//# sourceMappingURL=frequency-cap.d.ts.map