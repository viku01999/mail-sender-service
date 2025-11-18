import { DataSource } from "typeorm";




export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: "10.8.0.1",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "notification",
    entities: ["src/entity/*.ts"],
    migrations: ["src/migration/*.ts"],
    synchronize: true,
    logging: true
})
