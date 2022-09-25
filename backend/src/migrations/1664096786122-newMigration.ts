import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1664096786122 implements MigrationInterface {
  name = 'newMigration1664096786122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD "createdByRemove" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD "billedToRemove" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP COLUMN "billedToRemove"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP COLUMN "createdByRemove"`,
    );
  }
}
