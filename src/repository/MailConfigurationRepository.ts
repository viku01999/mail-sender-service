import { PostgresDataSource } from "../config/PostgresDataSource";
import { MailConfiguration } from "../entity/MailConfiguration";






const mailConfigRepo = PostgresDataSource.getRepository(MailConfiguration);

export const addMailConfiguration = async (orgId: string, configData: Partial<MailConfiguration>) => {
  const mailConfig = mailConfigRepo.create({
    ...configData,
    organization: { id: orgId },
  });
  return await mailConfigRepo.save(mailConfig);
};

export const getMailConfigsByOrg = async (orgId: string) => {
  return await mailConfigRepo.find({
    where: { organization: { id: orgId } },
  });
};
