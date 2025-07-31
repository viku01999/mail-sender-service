import nodemailer from 'nodemailer';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface PoolConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  maxConnections?: number;
  maxMessages?: number;
}

export async function sendMailWithPool(config: PoolConfig, mailOptions: MailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    pool: true,
    maxConnections: config.maxConnections || 5,
    maxMessages: config.maxMessages || 100,
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending mail:', error);
    throw error;
  } finally {
    transporter.close();
  }
}
