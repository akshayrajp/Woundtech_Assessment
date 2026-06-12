import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCliniciansTable1781292009843 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE clinicians (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

          given_name VARCHAR(100) NOT NULL,
          family_name VARCHAR(100) NOT NULL,
          date_of_birth DATE NOT NULL,
          gender gender NOT NULL DEFAULT 'unknown',

          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ
      );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS clinicians;`);
  }
}
