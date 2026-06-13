import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
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
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({
    format: 'uuid',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  })
  @IsUUID()
  @IsNotEmpty()
  clinicianId: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-06-13T14:30:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  visitedAt: Date;

  @ApiPropertyOptional({
    example: 'Patient presented with wound healing normally.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateVisitDto extends PartialType(CreateVisitRequestDto) {}

export class VisitInfoDto {
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    type: PatientInfoDto,
  })
  patient: Partial<PatientInfoDto>;

  @ApiProperty({
    type: ClinicianInfoDto,
  })
  clinician: Partial<ClinicianInfoDto>;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-06-13T14:30:00Z',
  })
  visitedAt: Date;

  @ApiPropertyOptional({
    example: 'Patient presented with wound healing normally.',
  })
  notes?: string;
}

export enum VisitOrderBy {
  VISITED_AT = 'visitedAt',
}

export class VisitPaginationRequestDto extends PaginationRequestDto {
  @ApiPropertyOptional({
    enum: VisitOrderBy,
    example: VisitOrderBy.VISITED_AT,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(VisitOrderBy)
  orderBy?: VisitOrderBy;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Filter by patient IDs',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    ],
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsUUID('4', { each: true })
  patientIds?: string[];

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Filter by clinician IDs',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    ],
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsUUID('4', { each: true })
  clinicianIds?: string[];
}

export class PaginatedVisitInfoDto extends BasePaginationResponseDto {
  @ApiProperty({
    type: [VisitInfoDto],
  })
  declare data: VisitInfoDto[];
}
