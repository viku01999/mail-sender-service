import { OrganizationService } from './organization.service';
import { MailConfigurationService } from './mailConfiguration.service';
import { sendMailSMTP465 } from '../mailSender/smtp465';
import { sendMailSMTP587 } from '../mailSender/smtp587';
import { sendMailOAuth2 } from '../mailSender/oauth2';

export class MailSenderService {
  private organizationService: OrganizationService;
  private mailConfigurationService: MailConfigurationService;

  constructor() {
    this.organizationService = new OrganizationService();
    this.mailConfigurationService = new MailConfigurationService();
  }

  async sendEmailWithClientCredentials(clientId: string, clientSecret: string, to: string, subject?: string, text?: string, html?: string, attachments?: any[]) {
    const organization = await this.organizationService.getOrganizationByClientCredentials(clientId, clientSecret);
    if (!organization) {
      throw new Error('Organization not found for the given client credentials');
    }

    let mailConfigs = await this.mailConfigurationService.getMailConfigurationsByOrganization(organization);

    if (!mailConfigs || mailConfigs.length === 0) {
      throw new Error('No mail configurations found for the organization');
    }

    mailConfigs = mailConfigs.sort((a, b) => (b.isDefaultMail ? 1 : 0) - (a.isDefaultMail ? 1 : 0));

    const results: { credential: string; success: boolean; error?: string }[] = [];

    for (const mailConfig of mailConfigs) {
      const { host, port, username, from,  password, credentialType, extraCredentials } = mailConfig;

      const mailOptions = {
        from: from,
        to,
        subject: subject || '',
        text: text || '',
        html: html || '',
        attachments: attachments || [],
      };

      try {
        if (credentialType === 'OAuth2' && extraCredentials) {
          const { clientId: oauthClientId, clientSecret: oauthClientSecret, refreshToken } = extraCredentials as {
            clientId: string;
            clientSecret: string;
            refreshToken: string;
          };
          await sendMailOAuth2({
            host,
            port,
            user: username,
            clientId: oauthClientId,
            clientSecret: oauthClientSecret,
            refreshToken,
          }, mailOptions);
        } else if (port === 465) {
          await sendMailSMTP465({ host, user: username, pass: password }, mailOptions);
        } else{
          await sendMailSMTP587({ host, user: username, pass: password }, mailOptions);
        }
        results.push({ credential: username, success: true });
        return { success: true, message: `Email sent successfully using credential: ${username}`, details: results };
      } catch (error: any) {
        results.push({ credential: username, success: false, error: error.message || 'Failed to send email' });
      }
    }

    // If all attempts failed
    return { success: false, message: 'Failed to send email with all credentials', details: results };
  }
}
