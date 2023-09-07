module.exports = class Data1694391813917 {
    name = 'Data1694391813917'

    async up(db) {
        await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, "decimals" integer NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "erc20_deposit" ("id" character varying NOT NULL, "from" text NOT NULL, "amount" numeric NOT NULL, "token_id" character varying, CONSTRAINT "PK_2133d70f2a4f52046ea0c6640d8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_a1e936c5aefe4a28950d432926" ON "erc20_deposit" ("token_id") `)
        await db.query(`ALTER TABLE "input" ADD "erc20_deposit_id" character varying`)
        await db.query(`CREATE INDEX "IDX_dca341c2e704b37b738842adb6" ON "input" ("erc20_deposit_id") `)
        await db.query(`ALTER TABLE "erc20_deposit" ADD CONSTRAINT "FK_a1e936c5aefe4a28950d4329264" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "input" ADD CONSTRAINT "FK_dca341c2e704b37b738842adb65" FOREIGN KEY ("erc20_deposit_id") REFERENCES "erc20_deposit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "token"`)
        await db.query(`DROP TABLE "erc20_deposit"`)
        await db.query(`DROP INDEX "public"."IDX_a1e936c5aefe4a28950d432926"`)
        await db.query(`ALTER TABLE "input" DROP COLUMN "erc20_deposit_id"`)
        await db.query(`DROP INDEX "public"."IDX_dca341c2e704b37b738842adb6"`)
        await db.query(`ALTER TABLE "erc20_deposit" DROP CONSTRAINT "FK_a1e936c5aefe4a28950d4329264"`)
        await db.query(`ALTER TABLE "input" DROP CONSTRAINT "FK_dca341c2e704b37b738842adb65"`)
    }
}
