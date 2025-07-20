import { DataSource } from "typeorm";




export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    entities: ["src/entity/*.ts"],
    migrations: ["src/migration/*.ts"],
    synchronize: true,
    logging: true
})
