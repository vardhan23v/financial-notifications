/**
 * Renders a notification template for the given template ID and locale.
 *
 * 1. Loads the NotificationTemplate by ID.
 * 2. Loads the TemplateLocale row matching the requested locale.
 * 3. If no match, falls back to the default locale (en-IN).
 * 4. Compiles and renders subject + body with the provided variables.
 *
 * @returns The rendered body string.
 */
export declare function renderTemplate(templateId: string, locale: string, variables: Record<string, unknown>): Promise<string>;
/**
 * Renders both subject and body for a template. Useful when the caller
 * needs the subject line as well (e.g., email delivery).
 */
export declare function renderTemplateFull(templateId: string, locale: string, variables: Record<string, unknown>): Promise<{
    subject: string;
    body: string;
}>;
//# sourceMappingURL=templates.d.ts.map