import {MigrationInterface, QueryRunner} from "typeorm";

export class UserFirstName1612719170272 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME "fullName" to "firstName"`);
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME "firstName" to "fullName"`);
    }
}
