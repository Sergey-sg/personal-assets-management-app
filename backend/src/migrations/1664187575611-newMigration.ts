import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1664187575611 implements MigrationInterface {
  name = 'newMigration1664187575611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoices" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "createdByRemove" boolean NOT NULL DEFAULT false, "billedToRemove" boolean NOT NULL DEFAULT false, "paid" boolean NOT NULL DEFAULT false, "discount" integer NOT NULL DEFAULT '0', "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL, "invoiceDate" TIMESTAMP WITH TIME ZONE, "invoiceDetails" character varying(500), "total" integer NOT NULL DEFAULT '0', "createdById" integer, "billedToId" integer, CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_item" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(300) NOT NULL, "amount" integer NOT NULL DEFAULT '0', "price" integer NOT NULL DEFAULT '0', "subTotal" integer NOT NULL DEFAULT '0', "invoiceId" integer, CONSTRAINT "PK_621317346abdf61295516f3cb76" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_dc9c84f58ab53b5c844c276e435" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_fe6fc9ac453fb0cf3668ab5da50" FOREIGN KEY ("billedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_item" ADD CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice_item" DROP CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_fe6fc9ac453fb0cf3668ab5da50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_dc9c84f58ab53b5c844c276e435"`,
    );
    await queryRunner.query(`DROP TABLE "invoice_item"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
  }
}
