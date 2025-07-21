import { Repository } from "typeorm";
import { MailConfiguration } from "../entity/MailConfiguration";




export class MailConfigurationRepository extends Repository<MailConfiguration> {

    createMailConfiguration = async (mailConfigData: MailConfiguration) => {
        return await this.save(mailConfigData);
    };

    getMailConfigurationByMailConfigId = async (mailConfigId: string) => {
        return await this.findOne({ where: { mailConfigId } });
    };

    deleteMailConfiguration = async (mailConfigId: string) => {
        await this.delete(mailConfigId);
    };

    getMailConfigurationsByOrganizationId = async (organizationId: string) => {
        return await this.find({
            where: { organizationDetails: { organizationId } }
        });
    };
}
