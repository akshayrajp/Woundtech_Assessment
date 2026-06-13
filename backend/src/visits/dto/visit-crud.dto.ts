import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ClinicianInfoDto } from 'src/clinicians/dto/clinician-crud.dto';
import {
  BasePaginationResponseDto,
  PaginationRequestDto,
} from 'src/common/dto/pagination.dto';
import { PatientInfoDto } from 'src/patients/dto/patient-crud.dto';

export class CreateVisitRequestDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  clinicianId: string;

  @IsDateString()
  @IsNotEmpty()
  visitedAt: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateVisitDto extends PartialType(CreateVisitRequestDto) {}

export class VisitInfoDto {
  id: string;
  patient: Partial<PatientInfoDto>;
  clinician: Partial<ClinicianInfoDto>;
  visitedAt: Date;
  notes?: string;
}

export enum VisitOrderBy {
  VISITED_AT = 'visitedAt',
}

export class VisitPaginationRequestDto extends PaginationRequestDto {
  @IsOptional()
  @IsEnum(VisitOrderBy)
  orderBy?: VisitOrderBy;
}

export class PaginatedVisitInfoDto extends BasePaginationResponseDto {
  data: VisitInfoDto[];
}
