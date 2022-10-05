import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
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
    example: 700,
    description: 'Income sum is integer number',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly income_sum?: number;

  @ApiProperty({
    example: '2022-09-07T11:44:17.300Z',
    description: 'Income create date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  readonly createdAt?: Date;

  @ApiProperty({
    example: '2022-09-07T10:22:15.300Z',
    description: 'Income alternative date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  readonly alternative_date?: Date;
}
