import { Visit } from 'src/visits/entities/visit.entity';
import { Gender } from 'src/common/enums/gender.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity({ name: 'clinicians' })
@Index(['givenName'])
@Index(['familyName'])
@Index(['createdAt'])
export class Clinician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'given_name' })
  givenName: string;

  @Column({ type: 'varchar', name: 'family_name' })
  familyName: string;

  @Column({ type: 'date', name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, name: 'gender' })
  gender: Gender;

  @OneToMany(() => Visit, (visit) => visit.clinician)
  visits: Visit[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
