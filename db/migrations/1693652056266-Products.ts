import { MigrationInterface, QueryRunner } from 'typeorm';

export class Products1693652056266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
          CREATE TABLE "Products" (
            "id" uuid NOT NULL primary key DEFAULT uuid_generate_v4(),
            "userId" uuid NOT NULL,
            "title" varchar(255) NOT NULL,
            "description" text,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
