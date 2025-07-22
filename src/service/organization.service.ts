import { OrganizationRepository } from '../repository/organization.repository';
import { OrganizationDetails } from '../entity/OrganizationDetails';
import { NotFoundError } from '../error/NotFoundError';

export class OrganizationService {
  private organizationRepository: typeof OrganizationRepository;

  constructor() {
    this.organizationRepository = OrganizationRepository;
  }

  async createOrganization(data: Partial<OrganizationDetails>): Promise<OrganizationDetails> {
    const organization = this.organizationRepository.create(data);
    return await this.organizationRepository.save(organization);
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
}
