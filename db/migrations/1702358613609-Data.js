module.exports = class Data1702358613609 {
    name = 'Data1702358613609'

    async up(db) {
        await db.query(`CREATE TABLE "nft" ("id" character varying NOT NULL, "name" text, "symbol" text, CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "erc721_deposit" ("id" character varying NOT NULL, "from" text NOT NULL, "token_index" numeric NOT NULL, "token_id" character varying, CONSTRAINT "PK_d23b7232706bd451820114b153e" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b79ae2a55e51afa505e904a123" ON "erc721_deposit" ("token_id") `)
        await db.query(`ALTER TABLE "input" ADD "erc721_deposit_id" character varying`)
        await db.query(`CREATE INDEX "IDX_0f62b1d844bf93606f92d72e73" ON "input" ("erc721_deposit_id") `)
        await db.query(`ALTER TABLE "erc721_deposit" ADD CONSTRAINT "FK_b79ae2a55e51afa505e904a1234" FOREIGN KEY ("token_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "input" ADD CONSTRAINT "FK_0f62b1d844bf93606f92d72e73f" FOREIGN KEY ("erc721_deposit_id") REFERENCES "erc721_deposit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "nft"`)
        await db.query(`DROP TABLE "erc721_deposit"`)
        await db.query(`DROP INDEX "public"."IDX_b79ae2a55e51afa505e904a123"`)
        await db.query(`ALTER TABLE "input" DROP COLUMN "erc721_deposit_id"`)
        await db.query(`DROP INDEX "public"."IDX_0f62b1d844bf93606f92d72e73"`)
        await db.query(`ALTER TABLE "erc721_deposit" DROP CONSTRAINT "FK_b79ae2a55e51afa505e904a1234"`)
        await db.query(`ALTER TABLE "input" DROP CONSTRAINT "FK_0f62b1d844bf93606f92d72e73f"`)
    }
}
