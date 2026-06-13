import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnDeleteCascadeConditionsForVisits1781380740246 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE visits
      DROP CONSTRAINT FK_visits_patient;

      ALTER TABLE visits
      ADD CONSTRAINT FK_visits_patient
      FOREIGN KEY (patient_id)
      REFERENCES patients(id)
      ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE visits
      DROP CONSTRAINT FK_visits_clinician;

      ALTER TABLE visits
      ADD CONSTRAINT FK_visits_clinician
      FOREIGN KEY (clinician_id)
      REFERENCES clinicians(id)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE visits
      DROP CONSTRAINT FK_visits_clinician;

      ALTER TABLE visits
      ADD CONSTRAINT FK_visits_clinician
      FOREIGN KEY (clinician_id)
      REFERENCES clinicians(id);
    `);

    await queryRunner.query(`
      ALTER TABLE visits
      DROP CONSTRAINT FK_visits_patient;

      ALTER TABLE visits
      ADD CONSTRAINT FK_visits_patient
      FOREIGN KEY (patient_id)
      REFERENCES patients(id);
    `);
  }
}
