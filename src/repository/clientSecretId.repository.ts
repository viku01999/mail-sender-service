import { Repository } from "typeorm";
import { ClientSecretId } from "../entity/ClientIdAndSecret";
import { PostgresDataSource } from "../config/PostgresDataSource";

export const ClientSecretIdRepository: Repository<ClientSecretId> = PostgresDataSource.getRepository(ClientSecretId);
