import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
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
    example: 142.45,
    description: 'Cost sum is integer or decimal number',
    required: false,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Cost sum could be integer or decimal number' },
  )
  @Min(0.01, { message: 'Sum must be greater than 0' })
  readonly cost_sum?: number;

  @ApiProperty({
    example: '2022-09-07T11:44:17.300Z',
    description: 'Cost create date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Must be a date' })
  readonly createdAt?: Date;

  @ApiProperty({
    example: '2022-09-07T10:22:15.300Z',
    description: 'Cost alternative date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Must be a date' })
  readonly alternative_date?: Date;
}
