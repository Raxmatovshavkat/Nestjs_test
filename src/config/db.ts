import * as dotenv from 'dotenv';
dotenv.config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log({
    DATABASE_DIALECT: process.env.DATABASE_DIALECT,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT_DB,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_DATABASE: process.env.DATABASE_DATABASE,
    DATABASE_AUTO_LOAD_MODELS: process.env.DATABASE_AUTO_LOAD_MODELS,
    DATABASE_SYNCHRONIZE: process.env.DATABASE_SYNCHRONIZE,
});

export const databaseConfig = (): TypeOrmModuleOptions => ({
    type: 'postgres',  // Postgres sifatida qattiq kodlangan
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT_DB, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    autoLoadEntities: process.env.DATABASE_AUTO_LOAD_MODELS === 'true',
    ssl: {
        rejectUnauthorized: false,
    },
    logging: false,
});
