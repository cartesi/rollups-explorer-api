module.exports = class Data1692906025879 {
    name = 'Data1692906025879'

    async up(db) {
        await db.query(`CREATE TABLE "application" ("id" character varying NOT NULL, "input_count" integer NOT NULL, "deployment_timestamp" numeric NOT NULL, "activity_timestamp" numeric NOT NULL, "owner" text, "factory_id" character varying, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7d9fd7ce83e3132d6a4faf0c22" ON "application" ("activity_timestamp") `)
        await db.query(`CREATE INDEX "IDX_8a4d9b1aa6e7498fef429b8770" ON "application" ("factory_id") `)
        await db.query(`CREATE TABLE "application_factory" ("id" character varying NOT NULL, CONSTRAINT "PK_8a4d9b1aa6e7498fef429b8770e" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_8a4d9b1aa6e7498fef429b8770e" FOREIGN KEY ("factory_id") REFERENCES "application_factory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "application"`)
        await db.query(`DROP INDEX "public"."IDX_7d9fd7ce83e3132d6a4faf0c22"`)
        await db.query(`DROP INDEX "public"."IDX_8a4d9b1aa6e7498fef429b8770"`)
        await db.query(`DROP TABLE "application_factory"`)
        await db.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_8a4d9b1aa6e7498fef429b8770e"`)
    }
}
