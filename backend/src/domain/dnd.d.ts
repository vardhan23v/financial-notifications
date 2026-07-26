/**
 * Checks whether a notification to the given user on the given channel
 * for the given event category is allowed under TRAI DND rules.
 *
 * @param userId - The recipient user ID
 * @param channel - The delivery channel (SMS, EMAIL, etc.)
 * @param eventCategory - The event type string (e.g. "margin_call")
 * @returns true if the notification is allowed, false if blocked by DND
 */
export declare function checkDND(userId: string, channel: string, eventCategory: string): Promise<boolean>;
//# sourceMappingURL=dnd.d.ts.map