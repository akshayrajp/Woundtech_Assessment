import { Clinician } from 'src/clinicians/entities/clinician.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  visitedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @JoinColumn({ name: 'patient_id' })
  @ManyToOne(() => Patient, { nullable: false })
  patient: Patient;

  @JoinColumn({ name: 'clinician_id' })
  @ManyToOne(() => Clinician, { nullable: false })
  clinician: Patient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
