import { MigrationInterface, QueryRunner } from "typeorm";

export class initialInvoiceItemInvoicesConstUserWalletIncomeDisplayInvoiceTables1664365550533 implements MigrationInterface {
    name = 'initialInvoiceItemInvoicesConstUserWalletIncomeDisplayInvoiceTables1664365550533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice_item" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(300) NOT NULL, "amount" integer NOT NULL DEFAULT '0', "price" integer NOT NULL DEFAULT '0', "subTotal" integer NOT NULL DEFAULT '0', "invoiceId" integer, CONSTRAINT "PK_621317346abdf61295516f3cb76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "paid" boolean NOT NULL DEFAULT false, "discount" integer NOT NULL DEFAULT '0', "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL, "invoiceDate" TIMESTAMP WITH TIME ZONE, "invoiceDetails" character varying(500), "total" integer NOT NULL DEFAULT '0', "createdById" integer, "billedToId" integer, CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "income" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_name" character varying(50) NOT NULL, "income_sum" numeric NOT NULL DEFAULT '0', "is_transaction" boolean NOT NULL DEFAULT false, "alternative_date" date, "from_user_id" integer, "wallet_id" integer, CONSTRAINT "PK_29a10f17b97568f70cee8586d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(64) NOT NULL, "lastName" character varying(64) NOT NULL, "email" character varying(320) NOT NULL, "password" character varying NOT NULL, "address" character varying, "phone" character varying, "birthdate" date, "refreshTokenHash" character varying, "activationLink" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "avatarPath" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_9ee730a54c4a83c48b28067abf0" UNIQUE ("activationLink"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "wallet_name" character varying(50) NOT NULL, "status" "public"."wallet_status_enum" NOT NULL DEFAULT 'open', "total_balance" numeric NOT NULL DEFAULT '0', "currency" "public"."wallet_currency_enum" NOT NULL DEFAULT 'UAH', "owner_id" integer, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "costs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cost_name" character varying(50) NOT NULL, "cost_sum" numeric NOT NULL DEFAULT '0', "is_transaction" boolean NOT NULL DEFAULT false, "alternative_date" date, "to_user_id" integer, "wallet_id" integer, CONSTRAINT "PK_05cc8aa05396a72553cdff6d5be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_invoices" ("invoice" integer NOT NULL, "user" integer NOT NULL, CONSTRAINT "PK_c641b743f8275343dd0581e53a1" PRIMARY KEY ("invoice", "user"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29844032db8ad189c30ef51e27" ON "user_invoices" ("invoice") `);
        await queryRunner.query(`CREATE INDEX "IDX_d4631ed7c078efc0f1c6330adf" ON "user_invoices" ("user") `);
        await queryRunner.query(`ALTER TABLE "invoice_item" ADD CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_dc9c84f58ab53b5c844c276e435" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_fe6fc9ac453fb0cf3668ab5da50" FOREIGN KEY ("billedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_cce098e434b6cd4a5b714118353" FOREIGN KEY ("from_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_a607de16c829e476070c3d5f4d5" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_26b096404e3b6ece7d44d88fb1a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "costs" ADD CONSTRAINT "FK_829c62c6ded28233438a9ccdd12" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "costs" ADD CONSTRAINT "FK_2f4b6f17fe7a1acf21ff50a06b2" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_invoices" ADD CONSTRAINT "FK_29844032db8ad189c30ef51e27a" FOREIGN KEY ("invoice") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_invoices" ADD CONSTRAINT "FK_d4631ed7c078efc0f1c6330adf2" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_invoices" DROP CONSTRAINT "FK_d4631ed7c078efc0f1c6330adf2"`);
        await queryRunner.query(`ALTER TABLE "user_invoices" DROP CONSTRAINT "FK_29844032db8ad189c30ef51e27a"`);
        await queryRunner.query(`ALTER TABLE "costs" DROP CONSTRAINT "FK_2f4b6f17fe7a1acf21ff50a06b2"`);
        await queryRunner.query(`ALTER TABLE "costs" DROP CONSTRAINT "FK_829c62c6ded28233438a9ccdd12"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_26b096404e3b6ece7d44d88fb1a"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_a607de16c829e476070c3d5f4d5"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_cce098e434b6cd4a5b714118353"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_fe6fc9ac453fb0cf3668ab5da50"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_dc9c84f58ab53b5c844c276e435"`);
        await queryRunner.query(`ALTER TABLE "invoice_item" DROP CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d4631ed7c078efc0f1c6330adf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29844032db8ad189c30ef51e27"`);
        await queryRunner.query(`DROP TABLE "user_invoices"`);
        await queryRunner.query(`DROP TABLE "costs"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "income"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TABLE "invoice_item"`);
    }

}
