import { MailConfiguration } from '../entity/MailConfiguration';
import { NotFoundError } from '../error/NotFoundError';
import { ClientSecretIdRepository } from '../repository/clientSecretId.repository';
import { MailConfigurationRepository } from '../repository/mailConfiguration.repository';
import { sendTestEmail } from '../utils/mailSenderUtil';

export class MailConfigurationService {
  private mailConfigurationRepository: typeof MailConfigurationRepository;
  private clientSecretIdRepository: typeof ClientSecretIdRepository;

  constructor() {
    this.mailConfigurationRepository = MailConfigurationRepository;
    this.clientSecretIdRepository = ClientSecretIdRepository;
  }

  async getMailConfigurationByOrganization(organization: any): Promise<MailConfiguration | null> {
    return await this.mailConfigurationRepository.findOne({
      where: {
        organizationDetails: organization,
      },
    });
  }

  async getMailConfigurationsByOrganization(organization: any): Promise<MailConfiguration[]> {
    return await this.mailConfigurationRepository.find({
      where: {
        organizationDetails: organization,
      },
    });
  }

  async createMailConfiguration(data: Partial<MailConfiguration>, clientId: string, clientSecret: string): Promise<MailConfiguration> {
    const clientSecretEntity = await this.clientSecretIdRepository.findOne({
      where: {
        clientId,
        clientSecret,
      },
      relations: ['organizationDetails'],
    });

    if (!clientSecretEntity) {
      throw new NotFoundError('Organization not found');
    }

    const organization = clientSecretEntity.organizationDetails;

    // If isDefaultMail is true, unset other default mail configs for this org
    if (data.isDefaultMail) {
      await this.mailConfigurationRepository.update(
        { organizationDetails: organization, isDefaultMail: true },
        { isDefaultMail: false }
      );
    }

    // Send test email to validate mail configuration before saving
    await sendTestEmail({
      host: data.host || '',
      port: data.port || 587,
      username: data.username || '',
      password: data.password,
      credentialType: data.credentialType || '',
      extraCredentials: data.extraCredentials,
    });

    const mailConfig = this.mailConfigurationRepository.create(data);

    let dataToBeSave = {
      ...mailConfig,
      organizationDetails: organization,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.mailConfigurationRepository.save(dataToBeSave);
  }

  async getMailConfigurations(): Promise<MailConfiguration[]> {
    return await this.mailConfigurationRepository.find();
  }

  async getMailConfigurationById(mailConfigId: string): Promise<MailConfiguration | null> {
    return await this.mailConfigurationRepository.findOne({ where: { mailConfigId } });
  }

  async updateMailConfiguration(mailConfigId: string, data: Partial<MailConfiguration>): Promise<MailConfiguration | null> {
    const mailConfig = await this.mailConfigurationRepository.findOne({ where: { mailConfigId }, relations: ['organizationDetails'] });
    if (!mailConfig) {
      throw new NotFoundError('Mail Configuration not found');
    }

    // If isDefaultMail is true, unset other default mail configs for this org
    if (data.isDefaultMail) {
      await this.mailConfigurationRepository.update(
        { organizationDetails: mailConfig.organizationDetails, isDefaultMail: true },
        { isDefaultMail: false }
      );
    }

    // Send test email to validate mail configuration before saving
    await sendTestEmail({
      host: data.host || mailConfig.host,
      port: data.port || mailConfig.port,
      username: data.username || mailConfig.username,
      password: data.password || mailConfig.password,
      credentialType: data.credentialType || mailConfig.credentialType,
      extraCredentials: data.extraCredentials || mailConfig.extraCredentials,
    });

    Object.assign(mailConfig, data);
    return await this.mailConfigurationRepository.save(mailConfig);
  }

  async makeDefaultMailConfiguration(mailConfigId: string, clientId: string, clientSecret: string): Promise<MailConfiguration | null> {
    const clientSecretEntity = await this.clientSecretIdRepository.findOne({
      where: {
        clientId,
        clientSecret,
      },
      relations: ['organizationDetails'],
    });

    if (!clientSecretEntity) {
      throw new NotFoundError('Organization not found');
    }

    const organization = clientSecretEntity.organizationDetails;

    // Unset all default mail configs for this org
    await this.mailConfigurationRepository.update(
      { organizationDetails: organization, isDefaultMail: true },
      { isDefaultMail: false }
    );

    // Set the specified mail config as default
    const mailConfig = await this.mailConfigurationRepository.findOne({ where: { mailConfigId, organizationDetails: organization } });
    if (!mailConfig) {
      throw new NotFoundError('Mail Configuration not found for the organization');
    }

    mailConfig.isDefaultMail = true;
    return await this.mailConfigurationRepository.save(mailConfig);
  }

  async deleteMailConfiguration(mailConfigId: string): Promise<void> {
    await this.mailConfigurationRepository.delete({ mailConfigId });
  }

  async incrementNumberOfMailSent(mailConfigId: string, incrementBy = 1): Promise<MailConfiguration | null> {
    const mailConfig = await this.mailConfigurationRepository.findOne({ where: { mailConfigId } });
    if (!mailConfig) {
      throw new NotFoundError('Mail Configuration not found');
    }
    mailConfig.numberOfMailSent = (mailConfig.numberOfMailSent || 0) + incrementBy;
    return await this.mailConfigurationRepository.save(mailConfig);
  }
}
