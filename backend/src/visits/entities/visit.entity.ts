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

@Entity({ name: 'visits' })
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', name: 'visited_at' })
  visitedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @JoinColumn({ name: 'patient_id' })
  @ManyToOne(() => Patient, { nullable: false })
  patient: Patient;

  @Column({ name: 'clinician_id', type: 'uuid' })
  clinicianId: string;

  @JoinColumn({ name: 'clinician_id' })
  @ManyToOne(() => Clinician, { nullable: false })
  clinician: Clinician;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
