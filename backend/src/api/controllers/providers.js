"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviders = getProviders;
exports.toggleProvider = toggleProvider;
const provider_1 = require("../../repositories/provider");
async function getProviders(req, res) {
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : undefined;
    const take = req.query.take ? parseInt(req.query.take, 10) : undefined;
    const result = await (0, provider_1.findAllProviders)({ skip, take });
    res.json(result);
}
async function toggleProvider(req, res) {
    const { id } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
        res.status(400).json({ error: "isActive must be a boolean" });
        return;
    }
    try {
        const provider = await (0, provider_1.updateProviderStatus)(id, isActive);
        res.json({ provider });
    }
    catch (err) {
        res.status(404).json({ error: "Provider not found" });
    }
}
//# sourceMappingURL=providers.js.map