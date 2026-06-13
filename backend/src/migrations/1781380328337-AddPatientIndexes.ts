import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPatientIndexes1781380328337 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX idx_patients_given_name
      ON patients(given_name);
      `);

    await queryRunner.query(`
      CREATE INDEX idx_patients_family_name
      ON patients(family_name);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_patients_created_at
      ON patients(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_patients_given_name;
      `);

    await queryRunner.query(`
      DROP INDEX idx_patients_family_name;
    `);

    await queryRunner.query(`
      DROP INDEX idx_patients_created_at;
    `);
  }
}
