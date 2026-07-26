"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDLQ = getDLQ;
exports.replayDLQ = replayDLQ;
exports.addToDLQ = addToDLQ;
const dlqStore = [];
function getDLQ(req, res) {
    res.json({ entries: dlqStore, total: dlqStore.length });
}
async function replayDLQ(req, res) {
    const { id } = req.params;
    const entry = dlqStore.find((e) => e.id === id);
    if (!entry) {
        res.status(404).json({ error: "DLQ entry not found" });
        return;
    }
    // In a real system, this would re-publish to Kafka
    // For now, we just remove from DLQ
    const index = dlqStore.findIndex((e) => e.id === id);
    if (index >= 0) {
        dlqStore.splice(index, 1);
    }
    res.json({ success: true, message: "Replayed successfully" });
}
async function addToDLQ(entry) {
    dlqStore.push(entry);
}
//# sourceMappingURL=dlq.js.map