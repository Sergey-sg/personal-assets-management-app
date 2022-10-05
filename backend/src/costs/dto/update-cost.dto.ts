import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateCostDto {
  @ApiProperty({
    example: 'My cost',
    description: 'Cost name',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Cost name can't be empti` })
  readonly cost_name?: string;

  @ApiProperty({
    example: 142,
    description: 'Cost sum is integer number',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly cost_sum?: number;

  @ApiProperty({
    example: '2022-09-07T11:44:17.300Z',
    description: 'Cost create date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  readonly createdAt?: Date;

  @ApiProperty({
    example: '2022-09-07T10:22:15.300Z',
    description: 'Cost alternative date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  readonly alternative_date?: Date;
}
