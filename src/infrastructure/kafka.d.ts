/**
 * Kafka client singleton — provides a single, lazily-initialized KafkaJS
 * producer for the lifetime of the process.
 */
import { Producer } from "kafkajs";
export declare function getKafkaProducer(): Producer;
/**
 * Gracefully disconnect the Kafka producer.
 */
export declare function disconnectKafka(): Promise<void>;
//# sourceMappingURL=kafka.d.ts.map