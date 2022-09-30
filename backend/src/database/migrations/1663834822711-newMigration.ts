import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1663834822711 implements MigrationInterface {
  name = 'newMigration1663834822711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_status_enum" AS ENUM('open', 'close')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "status" "public"."wallet_status_enum" NOT NULL DEFAULT 'open'`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "currency"`);
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_currency_enum" AS ENUM('UAH', 'EUR', 'USD')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "currency" "public"."wallet_currency_enum" NOT NULL DEFAULT 'UAH'`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD CONSTRAINT "FK_cce098e434b6cd4a5b714118353" FOREIGN KEY ("from_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "costs" ADD CONSTRAINT "FK_829c62c6ded28233438a9ccdd12" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "costs" DROP CONSTRAINT "FK_829c62c6ded28233438a9ccdd12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" DROP CONSTRAINT "FK_cce098e434b6cd4a5b714118353"`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "currency"`);
    await queryRunner.query(`DROP TYPE "public"."wallet_currency_enum"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "currency" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."wallet_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD "status" character varying(50) NOT NULL DEFAULT 'open'`,
    );
  }
}
