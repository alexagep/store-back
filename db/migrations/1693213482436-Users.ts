import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1693213482436 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        create table if not exists "Users"
        (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" varchar(255) NOT NULL,
            "lastName" varchar(255) NOT NULL,
            "email" varchar(255) unique NOT NULL,
            "password" text NOT NULL,
            "emailVerified" boolean default false
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(` DROP TABLE "users" `);
  }
}
