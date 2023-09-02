module.exports = class Data1693673115300 {
    name = 'Data1693673115300'

    async up(db) {
        await db.query(`CREATE TABLE "input" ("id" character varying NOT NULL, "index" integer NOT NULL, "msg_sender" text NOT NULL, "payload" text NOT NULL, "timestamp" numeric NOT NULL, "block_number" numeric NOT NULL, "block_hash" text NOT NULL, "transaction_hash" text NOT NULL, "application_id" character varying, CONSTRAINT "PK_a1deaa2fcdc821329884ad43931" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_366eb458f43eada5e787db7345" ON "input" ("application_id") `)
        await db.query(`ALTER TABLE "input" ADD CONSTRAINT "FK_366eb458f43eada5e787db73455" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "input"`)
        await db.query(`DROP INDEX "public"."IDX_366eb458f43eada5e787db7345"`)
        await db.query(`ALTER TABLE "input" DROP CONSTRAINT "FK_366eb458f43eada5e787db73455"`)
    }
}
