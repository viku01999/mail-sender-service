import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["10.8.0.1:9092"],  // replace with your Kafka brokers
});