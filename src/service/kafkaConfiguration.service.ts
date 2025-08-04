import { KafkaConfiguration } from '../entity/KafkaConfiguration';
import { NotFoundError } from '../error/NotFoundError';
import { ClientSecretIdRepository } from '../repository/clientSecretId.repository';
import { KafkaConfigurationRepository } from '../repository/kafkaConfiguration.repository';
import { Kafka } from 'kafkajs';

export class KafkaConfigurationService {
  constructor() {}

  async getKafkaConfigurationByOrganization(organization: any): Promise<KafkaConfiguration | null> {
    return await KafkaConfigurationRepository.findOne({
      where: {
        organization: organization,
      },
    });
  }

  async createKafkaConfiguration(
    data: Partial<KafkaConfiguration>,
    clientId: string,
    clientSecret: string
  ): Promise<KafkaConfiguration> {
    const clientSecretEntity = await ClientSecretIdRepository.findOne({
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

    // Check if configuration already exists for this organization
    const existingConfig = await KafkaConfigurationRepository.findOne({
      where: { organization: { organizationId: organization.organizationId } }
    });
    
    if (existingConfig) {
      throw new Error('Kafka configuration already exists for this organization');
    }

    // Validate Kafka connection before saving
    await this.validateKafkaConnection(data);

    const kafkaConfig = KafkaConfigurationRepository.create({
      ...data,
      organization: organization,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await KafkaConfigurationRepository.save(kafkaConfig);
  }

  async getKafkaConfigurations(): Promise<KafkaConfiguration[]> {
    return await KafkaConfigurationRepository.find();
  }

  async getKafkaConfigurationById(kafkaConfigId: string): Promise<KafkaConfiguration | null> {
    return await KafkaConfigurationRepository.findOne({ where: { kafkaConfigId } });
  }

  async updateKafkaConfiguration(
    kafkaConfigId: string,
    data: Partial<KafkaConfiguration>
  ): Promise<KafkaConfiguration | null> {
    const kafkaConfig = await KafkaConfigurationRepository.findOne({
      where: { kafkaConfigId },
      relations: ['organization'],
    });
    
    if (!kafkaConfig) {
      throw new NotFoundError('Kafka Configuration not found');
    }

    // Validate Kafka connection before updating
    await this.validateKafkaConnection({ ...kafkaConfig, ...data });

    Object.assign(kafkaConfig, data);
    kafkaConfig.updatedAt = new Date();
    
    return await KafkaConfigurationRepository.save(kafkaConfig);
  }

  async deleteKafkaConfiguration(kafkaConfigId: string): Promise<void> {
    const kafkaConfig = await KafkaConfigurationRepository.findOne({ where: { kafkaConfigId } });
    if (!kafkaConfig) {
      throw new NotFoundError('Kafka Configuration not found');
    }
    
    await KafkaConfigurationRepository.delete({ kafkaConfigId });
  }

  async validateKafkaConnection(config: Partial<KafkaConfiguration>): Promise<boolean> {
    try {
      const kafkaConfig: any = {
        clientId: config.clientId || 'test-client',
        brokers: config.bootstrapServers?.split(',').map(s => s.trim()) || [],
      };

      if (config.saslMechanism && config.saslUsername && config.saslPassword) {
        kafkaConfig.sasl = {
          mechanism: config.saslMechanism,
          username: config.saslUsername,
          password: config.saslPassword,
        };
      }

      const kafka = new Kafka(kafkaConfig);
      const admin = kafka.admin();
      
      await admin.connect();
      await admin.listTopics(); // Just test connection, don't create topics
      await admin.disconnect();
      
      return true;
    } catch (error) {
      throw new Error(`Invalid Kafka configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
