import {MigrationInterface, QueryRunner} from "typeorm";

export class UserName1612719871637 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME "firstName" to "name"`);
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME "name" to "firstName"`);
    }

}
