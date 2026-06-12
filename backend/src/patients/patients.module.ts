import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService],
  imports: [TypeOrmModule.forFeature([Patient])],
})
export class PatientsModule {}
