module.exports = class Data1706166961258 {
    name = 'Data1706166961258'

    async up(db) {
        await db.query(`CREATE TABLE "authority" ("id" character varying NOT NULL, CONSTRAINT "PK_b0f9bb35ff132fc6bd92d0582ce" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "validator_node" ("id" character varying NOT NULL, "runway" numeric, "location" text, "application_id" character varying, "provider_id" character varying, CONSTRAINT "PK_cc0fae80b68d3c7e4929b846da8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_620ac06bbf5dcf4692fcd7d6da" ON "validator_node" ("application_id") `)
        await db.query(`CREATE INDEX "IDX_ca05fc469559790a26dd6bca6b" ON "validator_node" ("provider_id") `)
        await db.query(`CREATE TABLE "validator_node_provider" ("id" character varying NOT NULL, "payee" text NOT NULL, "price" numeric NOT NULL, "paused" boolean NOT NULL, "authority_id" character varying, "token_id" character varying, CONSTRAINT "PK_ca05fc469559790a26dd6bca6be" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0551b931f1793eeaad67e0b254" ON "validator_node_provider" ("authority_id") `)
        await db.query(`CREATE INDEX "IDX_ba5f3d920d2961e583599fbfda" ON "validator_node_provider" ("token_id") `)
        await db.query(`ALTER TABLE "validator_node" ADD CONSTRAINT "FK_620ac06bbf5dcf4692fcd7d6da0" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "validator_node" ADD CONSTRAINT "FK_ca05fc469559790a26dd6bca6be" FOREIGN KEY ("provider_id") REFERENCES "validator_node_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "validator_node_provider" ADD CONSTRAINT "FK_0551b931f1793eeaad67e0b254d" FOREIGN KEY ("authority_id") REFERENCES "authority"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "validator_node_provider" ADD CONSTRAINT "FK_ba5f3d920d2961e583599fbfdae" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "authority"`)
        await db.query(`DROP TABLE "validator_node"`)
        await db.query(`DROP INDEX "public"."IDX_620ac06bbf5dcf4692fcd7d6da"`)
        await db.query(`DROP INDEX "public"."IDX_ca05fc469559790a26dd6bca6b"`)
        await db.query(`DROP TABLE "validator_node_provider"`)
        await db.query(`DROP INDEX "public"."IDX_0551b931f1793eeaad67e0b254"`)
        await db.query(`DROP INDEX "public"."IDX_ba5f3d920d2961e583599fbfda"`)
        await db.query(`ALTER TABLE "validator_node" DROP CONSTRAINT "FK_620ac06bbf5dcf4692fcd7d6da0"`)
        await db.query(`ALTER TABLE "validator_node" DROP CONSTRAINT "FK_ca05fc469559790a26dd6bca6be"`)
        await db.query(`ALTER TABLE "validator_node_provider" DROP CONSTRAINT "FK_0551b931f1793eeaad67e0b254d"`)
        await db.query(`ALTER TABLE "validator_node_provider" DROP CONSTRAINT "FK_ba5f3d920d2961e583599fbfdae"`)
    }
}
