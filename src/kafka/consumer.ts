import { MailSenderService } from "../service/mailSender.service";
import { kafka } from "./client";

const consumer = kafka.consumer({ groupId: "notification-service" });

const mailSenderService = new MailSenderService();

export async function connectConsumer() {
  await consumer.connect();
  console.log("Kafka Consumer connected");

  // Subscribe to the topic where inquiry messages are published
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

      // Parse the message
      let payload;
      try {
        payload = JSON.parse(message.value!.toString());
      } catch (err) {
        console.error("Invalid message format", err);
        return;
      }

      const { clientId, clientSecret, email, subject, text, html, attachments } = payload;

      // Send email
      try {
        if(email){
          await mailSenderService.sendEmailWithClientCredentials(
            clientId,
            clientSecret,
            email || '',
            "Enquiry Received Acknowledgement",
            "Thank you for contacting Sudosys! We will get in touch with you soon.",
            html,
            attachments
          );
          console.log(`Email sent successfully to ${email}`);
        }
        await mailSenderService.sendEmailWithClientCredentials(
            clientId,
            clientSecret,
            "indicate0@gmail.com",
            "Enquiry Alert",
            message.value?.toString(),
            html,
            attachments
          );
          console.log(`Email sent successfully to ${email}`);
      } catch (error: any) {
        console.error(`Failed to send email to ${email}:`, error.message || error);
      }
    },
  });
}

export default consumer;
