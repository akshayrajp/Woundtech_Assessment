import { Module } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module';
import { CliniciansModule } from './clinicians/clinicians.module';
import { VisitsModule } from './visits/visits.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PatientsModule,
    CliniciansModule,
    VisitsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
