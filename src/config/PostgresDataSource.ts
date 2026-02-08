import { DataSource } from "typeorm";
import { OTPVerification } from "../entity/OTPVerification";
import { SentEmail } from "../entity/SentEmail";
import { MailConfiguration } from "../entity/MailConfiguration";
import { KafkaConfiguration } from "../entity/KafkaConfiguration";
import { OrganizationDetails } from "../entity/OrganizationDetails";
import { ClientSecret } from "../entity/ClientIdAndSecret";
import 'dotenv/config';

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "10.8.0.1",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "notification",
    entities: [
        OTPVerification,
        SentEmail,
        MailConfiguration,
        KafkaConfiguration,
        OrganizationDetails,
        ClientSecret
    ],
    synchronize: true, // Be careful with this in production
    logging: process.env.NODE_ENV === 'development',
})


// export const PostgresDataSource = new DataSource({
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: "postgres",
//     password: "postgres",
//     database: "notification",
//     entities: ["src/entity/*.ts"],
//     migrations: ["src/migration/*.ts"],
//     synchronize: true,
//     logging: true
// })
