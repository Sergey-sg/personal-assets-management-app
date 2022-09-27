import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateIncomeDto {
  @ApiProperty({
    example: 'My income',
    description: 'Income category name',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Income category name can't be empti` })
  readonly category_name?: string;

  @ApiProperty({
    example: 700.54,
    description: 'Income sum is integer or decimal number',
    required: false,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Income sum could be integer or decimal number' },
  )
  @Min(0.01, { message: 'Sum must be greater than 0' })
  readonly income_sum?: number;

  @ApiProperty({
    example: '2022-09-07T11:44:17.300Z',
    description: 'Income create date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Must be a date' })
  readonly createdAt?: Date;

  @ApiProperty({
    example: '2022-09-07T10:22:15.300Z',
    description: 'Income alternative date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Must be a date' })
  readonly alternative_date?: Date;
}
