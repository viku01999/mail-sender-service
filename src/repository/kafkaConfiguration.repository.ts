import { Repository } from 'typeorm';
import { KafkaConfiguration } from '../entity/KafkaConfiguration';
import { PostgresDataSource } from '../config/PostgresDataSource';

export const KafkaConfigurationRepository: Repository<KafkaConfiguration> = PostgresDataSource.getRepository(KafkaConfiguration);

// Helper functions
export const findByOrganizationId = async (organizationId: string): Promise<KafkaConfiguration | null> => {
  return await KafkaConfigurationRepository.findOne({ 
    where: { organization: { organizationId } } 
  });
};

export const saveKafkaConfiguration = async (config: KafkaConfiguration): Promise<KafkaConfiguration> => {
  return await KafkaConfigurationRepository.save(config);
};

export const deleteByOrganizationId = async (organizationId: string): Promise<void> => {
  await KafkaConfigurationRepository.delete({ organization: { organizationId } });
};
