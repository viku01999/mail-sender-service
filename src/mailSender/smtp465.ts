import nodemailer from 'nodemailer';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
}

interface SMTP465Config {
  host: string;
  user: string;
  pass: string;
}

export async function sendMailSMTP465(config: SMTP465Config, mailOptions: MailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: 465,
    secure: true, // SSL
    auth: {
      user: config.user,
      pass: config.pass,
    },
    pool: true,
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
