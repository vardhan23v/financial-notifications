"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;
exports.renderTemplateFull = renderTemplateFull;
const handlebars_1 = __importDefault(require("handlebars"));
const prisma_1 = require("../../../src/infrastructure/prisma");
// ---------------------------------------------------------------------------
// Template Engine — loads templates with locale support and renders them
// with variable substitution via Handlebars.
// ---------------------------------------------------------------------------
const DEFAULT_LOCALE = "en-IN";
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
async function renderTemplate(templateId, locale, variables) {
    const prisma = (0, prisma_1.getPrismaClient)();
    // Load the base template
    const template = await prisma.notificationTemplate.findUnique({
        where: { id: templateId },
    });
    if (!template) {
        throw new Error(`Template not found: ${templateId}`);
    }
    // Try the requested locale first, then fall back to default
    let localeRow = await prisma.templateLocale.findUnique({
        where: { templateId_locale: { templateId, locale } },
    });
    if (!localeRow && locale !== DEFAULT_LOCALE) {
        localeRow = await prisma.templateLocale.findUnique({
            where: { templateId_locale: { templateId, locale: DEFAULT_LOCALE } },
        });
    }
    // Use locale overrides if available, otherwise use the base template fields
    const subjectTemplate = localeRow?.subject ?? template.subject;
    const bodyTemplate = localeRow?.body ?? template.body;
    const compiledSubject = handlebars_1.default.compile(subjectTemplate);
    const compiledBody = handlebars_1.default.compile(bodyTemplate);
    // Render subject (for logging / audit) and body
    compiledSubject(variables);
    return compiledBody(variables);
}
/**
 * Renders both subject and body for a template. Useful when the caller
 * needs the subject line as well (e.g., email delivery).
 */
async function renderTemplateFull(templateId, locale, variables) {
    const prisma = (0, prisma_1.getPrismaClient)();
    const template = await prisma.notificationTemplate.findUnique({
        where: { id: templateId },
    });
    if (!template) {
        throw new Error(`Template not found: ${templateId}`);
    }
    let localeRow = await prisma.templateLocale.findUnique({
        where: { templateId_locale: { templateId, locale } },
    });
    if (!localeRow && locale !== DEFAULT_LOCALE) {
        localeRow = await prisma.templateLocale.findUnique({
            where: { templateId_locale: { templateId, locale: DEFAULT_LOCALE } },
        });
    }
    const subjectTemplate = localeRow?.subject ?? template.subject;
    const bodyTemplate = localeRow?.body ?? template.body;
    const compiledSubject = handlebars_1.default.compile(subjectTemplate);
    const compiledBody = handlebars_1.default.compile(bodyTemplate);
    return {
        subject: compiledSubject(variables),
        body: compiledBody(variables),
    };
}
//# sourceMappingURL=templates.js.map