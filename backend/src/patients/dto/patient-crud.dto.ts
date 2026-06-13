import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Gender } from 'src/common/enums/gender.enum';
import {
  BasePaginationResponseDto,
  PaginationRequestDto,
} from 'src/common/dto/pagination.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientRequestDto {
  @ApiProperty({
    example: 'John',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  givenName: string;

  @ApiProperty({
    example: 'Doe',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  familyName: string;

  @ApiProperty({
    example: '1990-01-01',
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.male,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}

export class UpdatePatientDto extends PartialType(CreatePatientRequestDto) {}

export class PatientInfoDto {
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    example: 'John',
  })
  givenName: string;

  @ApiProperty({
    example: 'Doe',
  })
  familyName: string;

  @ApiProperty({
    type: String,
    format: 'date',
    example: '1990-01-01',
  })
  dateOfBirth: Date;

  @ApiProperty({
    enum: Gender,
    example: Gender.male,
  })
  gender: Gender;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-06-13T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-06-13T12:34:56.789Z',
  })
  updatedAt: Date;
}

export enum PatientOrderBy {
  GIVEN_NAME = 'givenName',
  FAMILY_NAME = 'familyName',
  DATE_OF_BIRTH = 'dateOfBirth',
  CREATED_AT = 'createdAt',
}

export class PatientPaginationRequestDto extends PaginationRequestDto {
  @ApiPropertyOptional({
    enum: PatientOrderBy,
    example: PatientOrderBy.GIVEN_NAME,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(PatientOrderBy)
  orderBy?: PatientOrderBy;
}

export class PaginatedPatientsInfoDto extends BasePaginationResponseDto {
  @ApiProperty({
    type: [PatientInfoDto],
  })
  declare data: PatientInfoDto[];
}
