import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVisitsIndexes1781380461849 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX idx_visits_patient
      ON visits(patient_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_visits_clinician
      ON visits(clinician_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_visits_created_at
      ON visits(created_at);
    `);

    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS pg_trgm;

      CREATE INDEX idx_visits_notes_trgm
      ON visits
      USING gin (notes gin_trgm_ops);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_visits_patient;
    `);

    await queryRunner.query(`
      DROP INDEX idx_visits_clinician;
    `);

    await queryRunner.query(`
      DROP INDEX idx_visits_created_at;
    `);

    await queryRunner.query(`
      DROP INDEX idx_visits_notes_trgm;
      DROP EXTENSION IF EXISTS pg_trgm;
    `);
  }
}
