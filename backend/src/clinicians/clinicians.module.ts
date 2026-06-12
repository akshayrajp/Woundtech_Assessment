import { Module } from '@nestjs/common';
import { CliniciansService } from './clinicians.service';
import { CliniciansController } from './clinicians.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinician } from './entities/clinician.entity';

@Module({
  controllers: [CliniciansController],
  providers: [CliniciansService],
  imports: [TypeOrmModule.forFeature([Clinician])],
})
export class CliniciansModule {}
