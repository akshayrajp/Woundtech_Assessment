import { Module } from '@nestjs/common';
import { CliniciansService } from './clinicians.service';
import { CliniciansController } from './clinicians.controller';

@Module({
  controllers: [CliniciansController],
  providers: [CliniciansService],
})
export class CliniciansModule {}
