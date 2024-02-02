module.exports = class Data1706849548900 {
    name = 'Data1706849548900'

    async up(db) {
        await db.query(`CREATE TABLE "authority" ("id" character varying NOT NULL, CONSTRAINT "PK_b0f9bb35ff132fc6bd92d0582ce" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "node" ("id" character varying NOT NULL, "runway" numeric, "location" text, "type" character varying(9) NOT NULL, "application_id" character varying, "provider_id" character varying, CONSTRAINT "PK_8c8caf5f29d25264abe9eaf94dd" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7a1582c5c19e59eaee8baf3b7c" ON "node" ("application_id") `)
        await db.query(`CREATE INDEX "IDX_bc6bc99eaa9a0b593c745054dd" ON "node" ("provider_id") `)
        await db.query(`CREATE TABLE "node_provider" ("id" character varying NOT NULL, "payee" text NOT NULL, "price" numeric NOT NULL, "paused" boolean NOT NULL, "type" character varying(9) NOT NULL, "authority_id" character varying, "token_id" character varying, CONSTRAINT "PK_bc6bc99eaa9a0b593c745054dd4" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_bf6c4c99e8df6a9004e9e8d0e3" ON "node_provider" ("authority_id") `)
        await db.query(`CREATE INDEX "IDX_12cd0de307dec107ad3184038a" ON "node_provider" ("token_id") `)
        await db.query(`ALTER TABLE "node" ADD CONSTRAINT "FK_7a1582c5c19e59eaee8baf3b7c2" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "node" ADD CONSTRAINT "FK_bc6bc99eaa9a0b593c745054dd4" FOREIGN KEY ("provider_id") REFERENCES "node_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "node_provider" ADD CONSTRAINT "FK_bf6c4c99e8df6a9004e9e8d0e3a" FOREIGN KEY ("authority_id") REFERENCES "authority"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "node_provider" ADD CONSTRAINT "FK_12cd0de307dec107ad3184038a1" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "authority"`)
        await db.query(`DROP TABLE "node"`)
        await db.query(`DROP INDEX "public"."IDX_7a1582c5c19e59eaee8baf3b7c"`)
        await db.query(`DROP INDEX "public"."IDX_bc6bc99eaa9a0b593c745054dd"`)
        await db.query(`DROP TABLE "node_provider"`)
        await db.query(`DROP INDEX "public"."IDX_bf6c4c99e8df6a9004e9e8d0e3"`)
        await db.query(`DROP INDEX "public"."IDX_12cd0de307dec107ad3184038a"`)
        await db.query(`ALTER TABLE "node" DROP CONSTRAINT "FK_7a1582c5c19e59eaee8baf3b7c2"`)
        await db.query(`ALTER TABLE "node" DROP CONSTRAINT "FK_bc6bc99eaa9a0b593c745054dd4"`)
        await db.query(`ALTER TABLE "node_provider" DROP CONSTRAINT "FK_bf6c4c99e8df6a9004e9e8d0e3a"`)
        await db.query(`ALTER TABLE "node_provider" DROP CONSTRAINT "FK_12cd0de307dec107ad3184038a1"`)
    }
}
