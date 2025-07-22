import { Repository } from "typeorm";
import { MailConfiguration } from "../entity/MailConfiguration";
import { PostgresDataSource } from "../config/PostgresDataSource";

export const MailConfigurationRepository: Repository<MailConfiguration> = PostgresDataSource.getRepository(MailConfiguration);


