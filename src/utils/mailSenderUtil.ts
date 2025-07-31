import { sendMailSMTP465 } from '../mailSender/smtp465';
import { sendMailSMTP587 } from '../mailSender/smtp587';
import { sendMailOAuth2 } from '../mailSender/oauth2';

interface MailConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  credentialType: string;
  extraCredentials?: any;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: any[];
}

export async function sendTestEmail(mailConfig: MailConfig): Promise<void> {
  const mailOptions: MailOptions = {
    from: mailConfig.username,
    to: mailConfig.username,
    subject: 'Test Email for Mail Configuration',
    text: 'This is a test email to verify mail configuration.',
  };

  if (mailConfig.credentialType === 'OAuth2' && mailConfig.extraCredentials) {
    const { clientId, clientSecret, refreshToken } = mailConfig.extraCredentials;
    await sendMailOAuth2(
      {
        host: mailConfig.host,
        port: mailConfig.port,
        user: mailConfig.username,
        clientId,
        clientSecret,
        refreshToken,
      },
      mailOptions
    );
  } else if (mailConfig.port === 465) {
    await sendMailSMTP465(
      {
        host: mailConfig.host,
        user: mailConfig.username,
        pass: mailConfig.password || '',
      },
      mailOptions
    );
  } else {
    await sendMailSMTP587(
      {
        host: mailConfig.host,
        user: mailConfig.username,
        pass: mailConfig.password || '',
      },
      mailOptions
    );
  }
}
