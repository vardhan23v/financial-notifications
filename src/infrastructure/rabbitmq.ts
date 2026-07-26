/**
 * RabbitMQ connection singleton — provides a single, lazily-initialized
 * amqplib channel for the lifetime of the process.
 */

import amqplib, { Channel, ChannelModel } from "amqplib";

let channelModel: ChannelModel | undefined;
let channel: Channel | undefined;

async function getChannelModel(): Promise<ChannelModel> {
  if (!channelModel) {
    const url = process.env.RABBITMQ_URL ?? "amqp://localhost:5672";
    channelModel = await amqplib.connect(url);

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

export async function getRabbitMQChannel(): Promise<Channel> {
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
export async function disconnectRabbitMQ(): Promise<void> {
  if (channel) {
    await channel.close();
    channel = undefined;
  }
  if (channelModel) {
    await channelModel.close();
    channelModel = undefined;
  }
}