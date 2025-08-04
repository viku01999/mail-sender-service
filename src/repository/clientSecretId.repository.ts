import { Repository } from "typeorm";
import { PostgresDataSource } from "../config/PostgresDataSource";
import { ClientSecret } from "../entity/ClientIdAndSecret";



export const ClientSecretIdRepository: Repository<ClientSecret> = PostgresDataSource.getRepository(ClientSecret);
