import { Repository } from "typeorm";
import { OrganizationDetails } from "../entity/OrganizationDetails";




export class OrganizationRepository extends Repository<OrganizationDetails> {

    public createOrganization = async (data: OrganizationDetails) => {
        return await this.save(data);
    }


    public getOrganizationDetails = async () => {
        return await this.find();
    }

    public getOrganizationById = async (organizationId: string) => {
        return await this.findOne({ where: { organizationId } });
    }

    public deleteOrganization = async (organizationId: string) => {
        return await this.delete({ organizationId });
    }

}