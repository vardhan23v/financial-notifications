"use strict";
/**
 * Kafka client singleton — provides a single, lazily-initialized KafkaJS
 * producer for the lifetime of the process.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKafkaProducer = getKafkaProducer;
exports.disconnectKafka = disconnectKafka;
const kafkajs_1 = require("kafkajs");
let kafka;
let producer;
function getKafka() {
    if (!kafka) {
        const brokersEnv = process.env.KAFKA_BROKERS ?? "localhost:9092";
        const brokers = brokersEnv.split(",").map((b) => b.trim());
        kafka = new kafkajs_1.Kafka({
            clientId: "pro4-backend",
            brokers,
            logLevel: process.env.NODE_ENV === "development" ? kafkajs_1.logLevel.INFO : kafkajs_1.logLevel.WARN,
        });
    }
    return kafka;
}
function getKafkaProducer() {
    if (!producer) {
        producer = getKafka().producer({
            allowAutoTopicCreation: true,
        });
    }
    return producer;
}
/**
 * Gracefully disconnect the Kafka producer.
 */
async function disconnectKafka() {
    if (producer) {
        await producer.disconnect();
        producer = undefined;
    }
}
//# sourceMappingURL=kafka.js.map