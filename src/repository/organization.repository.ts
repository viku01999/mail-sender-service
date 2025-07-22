import { Repository } from "typeorm";
import { OrganizationDetails } from "../entity/OrganizationDetails";
import { PostgresDataSource } from "../config/PostgresDataSource";

export const OrganizationRepository: Repository<OrganizationDetails> = PostgresDataSource.getRepository(OrganizationDetails);
