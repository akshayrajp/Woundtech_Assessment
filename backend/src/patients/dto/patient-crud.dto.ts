import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Gender } from 'src/common/enums/gender.enum';
import {
  BasePaginationResponseDto,
  PaginationRequestDto,
} from 'src/common/dto/pagination.dto';

export class CreatePatientRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  givenName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  familyName: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}

export class UpdatePatientDto extends PartialType(CreatePatientRequestDto) {}

export class PatientInfoDto {
  id: string;
  givenName: string;
  familyName: string;
  dateOfBirth: Date;
  gender: Gender;
  createdAt: Date;
  updatedAt: Date;
}

export enum PatientOrderBy {
  GIVEN_NAME = 'givenName',
  FAMILY_NAME = 'familyName',
  DATE_OF_BIRTH = 'dateOfBirth',
  CREATED_AT = 'createdAt',
}

export class PatientPaginationRequestDto extends PaginationRequestDto {
  @IsOptional()
  @IsEnum(PatientOrderBy)
  orderBy?: PatientOrderBy;
}

export class PaginatedPatientsInfoDto extends BasePaginationResponseDto {
  data: PatientInfoDto[];
}
