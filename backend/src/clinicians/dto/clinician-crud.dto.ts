import { IsDateString, IsEnum, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Gender } from 'src/common/enums/gender.enum';
import { BasePaginationResponseDto } from 'src/common/dto/pagination.dto';

export class CreateClinicianRequestDto {
  @IsString()
  @MaxLength(100)
  givenName: string;

  @IsString()
  @MaxLength(100)
  familyName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;
}

export class UpdateClinicianDto extends PartialType(
  CreateClinicianRequestDto,
) {}

export class ClinicianInfoDto {
  id: string;
  givenName: string;
  familyName: string;
  dateOfBirth: Date;
  gender: Gender;
  createdAt: Date;
  updatedAt: Date;
}

export class ClinicianDeletedDto {
  id: string;
  deleted: boolean;
}

export class PaginatedCliniciansInfoDto extends BasePaginationResponseDto<ClinicianInfoDto> {}
