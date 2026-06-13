import { ApiProperty } from '@nestjs/swagger';

export class DeleteResultDto {
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    example: true,
  })
  deleted: boolean;
}
