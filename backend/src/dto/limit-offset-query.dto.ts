import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class LimitOffsetQueryDto {
  @ApiProperty({
    example: 7,
    type: Number,
    description: 'Query limit',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly limit?: number;

  @ApiProperty({ example: 5, description: 'Query offset', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly offset?: number;
}
