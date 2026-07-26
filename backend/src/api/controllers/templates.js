"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplates = getTemplates;
exports.createTemplateHandler = createTemplateHandler;
exports.updateTemplateHandler = updateTemplateHandler;
exports.deleteTemplateHandler = deleteTemplateHandler;
const template_1 = require("../../repositories/template");
async function getTemplates(req, res) {
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : undefined;
    const take = req.query.take ? parseInt(req.query.take, 10) : undefined;
    const result = await (0, template_1.findAllTemplates)({ skip, take });
    res.json(result);
}
async function createTemplateHandler(req, res) {
    const { eventType, channel, subject, body } = req.body;
    if (!eventType || !channel || !subject || !body) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    try {
        const template = await (0, template_1.createTemplate)({ eventType, channel, subject, body });
        res.status(201).json(template);
    }
    catch (err) {
        res.status(409).json({ error: "Template already exists for this event type and channel" });
    }
}
async function updateTemplateHandler(req, res) {
    const { id } = req.params;
    const { subject, body, isActive } = req.body;
    try {
        const template = await (0, template_1.updateTemplate)(id, { subject, body, isActive });
        res.json(template);
    }
    catch (err) {
        res.status(404).json({ error: "Template not found" });
    }
}
async function deleteTemplateHandler(req, res) {
    const { id } = req.params;
    try {
        await (0, template_1.deleteTemplate)(id);
        res.status(204).send();
    }
    catch (err) {
        res.status(404).json({ error: "Template not found" });
    }
}
//# sourceMappingURL=templates.js.map