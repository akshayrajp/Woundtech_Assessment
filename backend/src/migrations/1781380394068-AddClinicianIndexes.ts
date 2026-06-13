import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClinicianIndexes1781380394068 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE INDEX idx_clinicians_given_name
        ON clinicians(given_name);
      `);

    await queryRunner.query(`
        CREATE INDEX idx_clinicians_family_name
        ON clinicians(family_name);
      `);

    await queryRunner.query(`
        CREATE INDEX idx_clinicians_created_at
        ON clinicians(created_at);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX idx_clinicians_given_name;
      `);

    await queryRunner.query(`
        DROP INDEX idx_clinicians_family_name;
      `);

    await queryRunner.query(`
        DROP INDEX idx_clinicians_created_at;
      `);
  }
}
