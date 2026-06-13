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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClinicianRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'John',
    maxLength: 100,
  })
  givenName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Doe',
    maxLength: 100,
  })
  familyName: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1990-01-01',
    format: 'date',
  })
  dateOfBirth: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  @ApiProperty({
    enum: Gender,
    example: Gender.male,
  })
  gender: Gender;
}

export class UpdateClinicianDto extends PartialType(
  CreateClinicianRequestDto,
) {}

export class ClinicianInfoDto {
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    example: 'John',
    maxLength: 100,
  })
  givenName: string;

  @ApiProperty({
    example: 'Doe',
    maxLength: 100,
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

export enum ClinicianOrderBy {
  GIVEN_NAME = 'givenName',
  FAMILY_NAME = 'familyName',
  DATE_OF_BIRTH = 'dateOfBirth',
  CREATED_AT = 'createdAt',
}

export class ClinicianPaginationRequestDto extends PaginationRequestDto {
  @ApiPropertyOptional({
    enum: ClinicianOrderBy,
    description: 'Field to sort by',
    example: ClinicianOrderBy.GIVEN_NAME,
  })
  @IsOptional()
  @IsEnum(ClinicianOrderBy)
  orderBy?: ClinicianOrderBy;
}

export class PaginatedCliniciansInfoDto extends BasePaginationResponseDto {
  @ApiProperty({
    type: [ClinicianInfoDto],
  })
  declare data: ClinicianInfoDto[];
}
