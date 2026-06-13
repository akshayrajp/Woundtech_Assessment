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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationRequestDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    example: 1,
    description: 'Page number (1-based)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    minLength: 3,
    example: 'john',
    description: 'Search term',
  })
  @IsOptional()
  @MinLength(3)
  search?: string;

  @ApiPropertyOptional({
    enum: SortDirection,
    default: SortDirection.ASC,
    example: SortDirection.ASC,
    description: 'Sort direction',
  })
  @IsOptional()
  @IsEnum(SortDirection)
  sortBy: SortDirection = SortDirection.ASC;
}

export class BasePaginationResponseDto {
  @ApiProperty({
    example: 42,
    description: 'Total number of matching records',
  })
  total: number;

  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
  })
  limit: number;
}
