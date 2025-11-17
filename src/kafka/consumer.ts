import { kafka } from "./client";

const consumer = kafka.consumer({ groupId: "notification-service" });

export async function connectConsumer() {
  await consumer.connect();
  console.log("Kafka Consumer connected");

  await consumer.subscribe({
    topic: "crm.inquiry.created",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Message received:", {
        topic,
        partition,
        value: message.value?.toString(),
      });

      // Process message here
      // e.g. update DB, analytics, notifications...
    },
  });
}

export default consumer;
