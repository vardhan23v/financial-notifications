/**
 * Kafka client singleton — provides a single, lazily-initialized KafkaJS
 * producer for the lifetime of the process.
 */

import { Kafka, Producer, logLevel } from "kafkajs";

let kafka: Kafka | undefined;
let producer: Producer | undefined;

function getKafka(): Kafka {
  if (!kafka) {
    const brokersEnv = process.env.KAFKA_BROKERS ?? "localhost:9092";
    const brokers = brokersEnv.split(",").map((b) => b.trim());

    kafka = new Kafka({
      clientId: "pro4-backend",
      brokers,
      logLevel: process.env.NODE_ENV === "development" ? logLevel.INFO : logLevel.WARN,
    });
  }
  return kafka;
}

export function getKafkaProducer(): Producer {
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
export async function disconnectKafka(): Promise<void> {
  if (producer) {
    await producer.disconnect();
    producer = undefined;
  }
}