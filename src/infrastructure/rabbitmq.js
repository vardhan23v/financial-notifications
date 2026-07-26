"use strict";
/**
 * RabbitMQ connection singleton — provides a single, lazily-initialized
 * amqplib channel for the lifetime of the process.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRabbitMQChannel = getRabbitMQChannel;
exports.disconnectRabbitMQ = disconnectRabbitMQ;
const amqplib_1 = __importDefault(require("amqplib"));
let channelModel;
let channel;
async function getChannelModel() {
    if (!channelModel) {
        const url = process.env.RABBITMQ_URL ?? "amqp://localhost:5672";
        channelModel = await amqplib_1.default.connect(url);
        channelModel.on("error", (err) => {
            console.error("[rabbitmq] connection error:", err.message);
        });
        channelModel.on("close", () => {
            console.warn("[rabbitmq] connection closed");
            channelModel = undefined;
            channel = undefined;
        });
    }
    return channelModel;
}
async function getRabbitMQChannel() {
    if (!channel) {
        const cm = await getChannelModel();
        channel = await cm.createChannel();
        channel.on("error", (err) => {
            console.error("[rabbitmq] channel error:", err.message);
        });
        channel.on("close", () => {
            console.warn("[rabbitmq] channel closed");
            channel = undefined;
        });
    }
    return channel;
}
/**
 * Gracefully close the RabbitMQ channel and connection.
 */
async function disconnectRabbitMQ() {
    if (channel) {
        await channel.close();
        channel = undefined;
    }
    if (channelModel) {
        await channelModel.close();
        channelModel = undefined;
    }
}
//# sourceMappingURL=rabbitmq.js.map