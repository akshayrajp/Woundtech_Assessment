import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, MinLength } from 'class-validator';

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
}

export class BasePaginationResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
