import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv";
import { User } from "../src/entities/User";
import { Blacklist } from "../src/entities/Blacklist";
import { Endeks } from "../src/entities/Endeks";
import { Consumption } from "../src/entities/Consumption";


dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        User,
        Blacklist,
        Endeks,
        Consumption,
    ],
    migrations: [],
    subscribers: [],
})

export const initializeDatabase = () => {
    AppDataSource.initialize().then(() => {
        console.log("Database connected")
    }).catch((error) => {
        console.error(error);
    });
};