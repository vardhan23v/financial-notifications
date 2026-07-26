/**
 * RabbitMQ connection singleton — provides a single, lazily-initialized
 * amqplib channel for the lifetime of the process.
 */
import { Channel } from "amqplib";
export declare function getRabbitMQChannel(): Promise<Channel>;
/**
 * Gracefully close the RabbitMQ channel and connection.
 */
export declare function disconnectRabbitMQ(): Promise<void>;
//# sourceMappingURL=rabbitmq.d.ts.map