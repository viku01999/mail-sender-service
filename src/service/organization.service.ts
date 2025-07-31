import { OrganizationDetails } from '../entity/OrganizationDetails';
import { NotFoundError } from '../error/NotFoundError';
import { ClientSecretIdRepository } from '../repository/clientSecretId.repository';
import { OrganizationRepository } from '../repository/organization.repository';
import { generateClientCredentials } from '../utils/clientCredentials';

export class OrganizationService {
  private organizationRepository: typeof OrganizationRepository;
  private clientSecretIdRepository: typeof ClientSecretIdRepository;

  constructor() {
    this.organizationRepository = OrganizationRepository;
    this.clientSecretIdRepository = ClientSecretIdRepository;
  }

  async createOrganization(data: Partial<OrganizationDetails>): Promise<any> {
    const organization = this.organizationRepository.create(data);
    const dataToBeSave = {
      ...organization,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const savedOrganization = await this.organizationRepository.save(dataToBeSave);

    const { clientId, clientSecret } = generateClientCredentials();

    const clientSecretIdEntity = this.clientSecretIdRepository.create({
      clientId,
      clientSecret,
      organizationDetails: savedOrganization,
    });

    const savedClientSecretId = await this.clientSecretIdRepository.save(clientSecretIdEntity);


    return {
      organization: savedOrganization,
      clientCredentials: {
        clientSecretId: savedClientSecretId.clientSecretId,
        clientId: savedClientSecretId.clientId,
        clientSecret: savedClientSecretId.clientSecret,
      },
    };
  }

  async getOrganizationDetails(): Promise<OrganizationDetails[]> {
    return await this.organizationRepository.find();
  }

  async getOrganizationById(organizationId: string): Promise<OrganizationDetails | null> {
    return await this.organizationRepository.findOne({ where: { organizationId } });
  }

  async updateOrganization(organizationId: string, data: Partial<OrganizationDetails>): Promise<OrganizationDetails | null> {
    const organization = await this.organizationRepository.findOne({ where: { organizationId } });
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }
    Object.assign(organization, data);
    return await this.organizationRepository.save(organization);
  }

  async deleteOrganization(organizationId: string): Promise<void> {
    await this.organizationRepository.delete({ organizationId });
  }

  async getOrganizationByClientCredentials(clientId: string, clientSecret: string): Promise<OrganizationDetails | null> {
    const clientSecretEntity = await this.clientSecretIdRepository.findOne({
      where: {
        clientId,
        clientSecret,
      },
      relations: ['organizationDetails'],
    });

    if (!clientSecretEntity) {
      return null;
    }

    return clientSecretEntity.organizationDetails;
  }
}
