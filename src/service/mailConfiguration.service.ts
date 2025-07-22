import { MailConfigurationRepository } from '../repository/mailConfiguration.repository';
import { MailConfiguration } from '../entity/MailConfiguration';
import { NotFoundError } from '../error/NotFoundError';

export class MailConfigurationService {
  private mailConfigurationRepository: typeof MailConfigurationRepository;

  constructor() {
    this.mailConfigurationRepository = MailConfigurationRepository;
  }

  async createMailConfiguration(data: Partial<MailConfiguration>): Promise<MailConfiguration> {
    const mailConfig = this.mailConfigurationRepository.create(data);
    return await this.mailConfigurationRepository.save(mailConfig);
  }

  async getMailConfigurations(): Promise<MailConfiguration[]> {
    return await this.mailConfigurationRepository.find();
  }

  async getMailConfigurationById(mailConfigId: string): Promise<MailConfiguration | null> {
    return await this.mailConfigurationRepository.findOne({ where: { mailConfigId } });
  }

  async updateMailConfiguration(mailConfigId: string, data: Partial<MailConfiguration>): Promise<MailConfiguration | null> {
    const mailConfig = await this.mailConfigurationRepository.findOne({ where: { mailConfigId } });
    if (!mailConfig) {
      throw new NotFoundError('Mail Configuration not found');
    }
    Object.assign(mailConfig, data);
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
