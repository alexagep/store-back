import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { Users } from '../users/users.entity';
import { Products } from '../products/products.entity';
// import { join } from 'node:path';
const CONNECTION_TYPE = 'postgres';

/* The registerAs function is used to register this configuration file behind a specified token,
which can then be used to load the configuration options in the TypeORM module using ConfigService. */
export default registerAs(
  'typeorm',
  (): DataSourceOptions => ({
    type: CONNECTION_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [Users, Products],
    // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../../db/migration/*.{.ts,.js}'],
  }),
);
