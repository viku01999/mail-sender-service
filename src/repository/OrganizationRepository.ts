import { PostgresDataSource } from "../config/PostgresDataSource";
import { MailConfiguration } from "../entity/MailConfiguration";
import { OrganizationDetails } from "../entity/OrganizationDetails";


const organizationRepo = PostgresDataSource.getRepository(OrganizationDetails);

export const createOrganizationWithDefaultMail = async (
  orgData: Partial<OrganizationDetails>,
  mailConfigData?: Partial<MailConfiguration>
) => {
  const organization = new OrganizationDetails();
  organization.name = orgData.name!;
  organization.domain = orgData.domain!;

  const mailConfig = new MailConfiguration();
  mailConfig.smtpHost = mailConfigData?.smtpHost ?? 'smtp.example.com';
  mailConfig.smtpPort = mailConfigData?.smtpPort ?? 587;
  mailConfig.username = mailConfigData?.username ?? 'default@example.com';
  mailConfig.password = mailConfigData?.password ?? 'secret';
  mailConfig.extraCredentials = mailConfigData?.extraCredentials ?? {};

  mailConfig.organization = organization;

  organization.mailConfigurations = [mailConfig];

  return await organizationRepo.save(organization); // cascade saves mail config too
};

export const deleteOrganization = async (orgId: string) => {
  return await organizationRepo.delete(orgId);
};
