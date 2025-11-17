import { kafka } from "./client";

const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  console.log("Kafka Producer connected");
}

export async function sendMessage<T>(topic: string, message: T) {
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });
}

export default producer;
