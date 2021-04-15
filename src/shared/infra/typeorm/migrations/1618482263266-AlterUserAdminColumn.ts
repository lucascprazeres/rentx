import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserAdminColumn1618482263266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("users", "isAdmin", "admin");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("users", "admin", "isAdmin");
  }
}
