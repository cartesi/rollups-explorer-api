module.exports = class Data1700532563386 {
    name = 'Data1700532563386'

    async up(db) {
        await db.query(`ALTER TABLE "application" ADD "timestamp" numeric NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "application" DROP COLUMN "timestamp"`)
    }
}
