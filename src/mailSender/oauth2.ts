import nodemailer from 'nodemailer';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
}

interface OAuth2Config {
  host: string;
  port: number;
  user: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessToken?: string;
}

export async function sendMailOAuth2(config: OAuth2Config, mailOptions: MailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      type: 'OAuth2',
      user: config.user,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken,
      accessToken: config.accessToken,
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
