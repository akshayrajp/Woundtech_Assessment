import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Clinician } from 'src/clinicians/entities/clinician.entity';

@Module({
  controllers: [VisitsController],
  providers: [VisitsService],
  imports: [TypeOrmModule.forFeature([Visit, Patient, Clinician])],
})
export class VisitsModule {}
