"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.updatePreferences = updatePreferences;
const user_1 = require("../../repositories/user");
async function getUsers(req, res) {
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : undefined;
    const take = req.query.take ? parseInt(req.query.take, 10) : undefined;
    const result = await (0, user_1.findAllUsers)({ skip, take });
    res.json(result);
}
async function updatePreferences(req, res) {
    const { userId } = req.params;
    const { channels, quietHoursStart, quietHoursEnd, language } = req.body;
    try {
        const preferences = await (0, user_1.updateUserPreferences)(userId, {
            channels,
            quietHoursStart,
            quietHoursEnd,
            language,
        });
        res.json(preferences);
    }
    catch (err) {
        res.status(404).json({ error: "User not found" });
    }
}
//# sourceMappingURL=users.js.map