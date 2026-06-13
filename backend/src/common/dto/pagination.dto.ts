import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { SortDirection } from '../enums/sortDirection.enum';

export class PaginationRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @MinLength(3)
  search?: string;

  @IsOptional()
  @IsEnum(SortDirection)
  sortBy: SortDirection = SortDirection.ASC;
}

export class BasePaginationResponseDto {
  total: number;
  page: number;
  limit: number;
}
