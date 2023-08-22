module.exports = class Data1692665461755 {
    name = 'Data1692665461755'

    async up(db) {
        await db.query(`CREATE TABLE "d_app" ("id" character varying NOT NULL, "input_count" integer NOT NULL, "deployment_timestamp" numeric NOT NULL, "activity_timestamp" numeric NOT NULL, "owner" text, "factory_id" character varying, CONSTRAINT "PK_7a3b316684352ff2f3901b02601" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_f74392a470dc9d3c58a06ef13b" ON "d_app" ("activity_timestamp") `)
        await db.query(`CREATE INDEX "IDX_9b406fc45b289311b6bd922947" ON "d_app" ("factory_id") `)
        await db.query(`CREATE TABLE "d_app_factory" ("id" character varying NOT NULL, CONSTRAINT "PK_9b406fc45b289311b6bd922947f" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "d_app" ADD CONSTRAINT "FK_9b406fc45b289311b6bd922947f" FOREIGN KEY ("factory_id") REFERENCES "d_app_factory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "d_app"`)
        await db.query(`DROP INDEX "public"."IDX_f74392a470dc9d3c58a06ef13b"`)
        await db.query(`DROP INDEX "public"."IDX_9b406fc45b289311b6bd922947"`)
        await db.query(`DROP TABLE "d_app_factory"`)
        await db.query(`ALTER TABLE "d_app" DROP CONSTRAINT "FK_9b406fc45b289311b6bd922947f"`)
    }
}
