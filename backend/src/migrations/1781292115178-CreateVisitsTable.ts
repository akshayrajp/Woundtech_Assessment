import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVisitsTable1781292115178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE visits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        patient_id UUID NOT NULL,
        clinician_id UUID NOT NULL,

        visited_at TIMESTAMPTZ NOT NULL,
        notes TEXT,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ,

        CONSTRAINT fk_visits_patient
          FOREIGN KEY (patient_id)
          REFERENCES patients(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_visits_clinician
          FOREIGN KEY (clinician_id)
          REFERENCES clinicians(id)
          ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_visits_patient_id
      ON visits(patient_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_visits_clinician_id
      ON visits(clinician_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_visits_visited_at
      ON visits(visited_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
       DROP INDEX IF EXISTS idx_visits_visited_at;
     `);

    await queryRunner.query(`
       DROP INDEX IF EXISTS idx_visits_clinician_id;
     `);

    await queryRunner.query(`
       DROP INDEX IF EXISTS idx_visits_patient_id;
     `);

    await queryRunner.query(`
       DROP TABLE IF EXISTS visits;
     `);
  }
}
