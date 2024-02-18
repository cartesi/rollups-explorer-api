module.exports = class Data1708227373111 {
    name = 'Data1708227373111'

    async up(db) {
        await db.query(`CREATE TABLE "multi_token" ("id" character varying NOT NULL, CONSTRAINT "PK_4e75ed8d2f8368d7275126e1e0a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "erc1155_deposit" ("id" character varying NOT NULL, "from" text NOT NULL, "transfers" jsonb, "token_id" character varying, CONSTRAINT "PK_e1ee5059e2ab545321addfc86ac" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_472cafd7ec482afd34406d4f5b" ON "erc1155_deposit" ("token_id") `)
        await db.query(`ALTER TABLE "input" ADD "erc1155_deposit_id" character varying`)
        await db.query(`CREATE INDEX "IDX_cbb39d6c16a954d68859315af8" ON "input" ("erc1155_deposit_id") `)
        await db.query(`ALTER TABLE "erc1155_deposit" ADD CONSTRAINT "FK_472cafd7ec482afd34406d4f5bc" FOREIGN KEY ("token_id") REFERENCES "multi_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "input" ADD CONSTRAINT "FK_cbb39d6c16a954d68859315af8d" FOREIGN KEY ("erc1155_deposit_id") REFERENCES "erc1155_deposit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "multi_token"`)
        await db.query(`DROP TABLE "erc1155_deposit"`)
        await db.query(`DROP INDEX "public"."IDX_472cafd7ec482afd34406d4f5b"`)
        await db.query(`ALTER TABLE "input" DROP COLUMN "erc1155_deposit_id"`)
        await db.query(`DROP INDEX "public"."IDX_cbb39d6c16a954d68859315af8"`)
        await db.query(`ALTER TABLE "erc1155_deposit" DROP CONSTRAINT "FK_472cafd7ec482afd34406d4f5bc"`)
        await db.query(`ALTER TABLE "input" DROP CONSTRAINT "FK_cbb39d6c16a954d68859315af8d"`)
    }
}
