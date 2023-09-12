module.exports = class Data1694486287347 {
    name = 'Data1694486287347'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_7d9fd7ce83e3132d6a4faf0c22"`)
        await db.query(`ALTER TABLE "application" DROP COLUMN "input_count"`)
        await db.query(`ALTER TABLE "application" DROP COLUMN "deployment_timestamp"`)
        await db.query(`ALTER TABLE "application" DROP COLUMN "activity_timestamp"`)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_7d9fd7ce83e3132d6a4faf0c22" ON "application" ("activity_timestamp") `)
        await db.query(`ALTER TABLE "application" ADD "input_count" integer NOT NULL`)
        await db.query(`ALTER TABLE "application" ADD "deployment_timestamp" numeric NOT NULL`)
        await db.query(`ALTER TABLE "application" ADD "activity_timestamp" numeric NOT NULL`)
    }
}
