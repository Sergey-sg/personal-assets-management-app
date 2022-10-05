import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({ example: 'My income', description: 'Income category name' })
  @IsNotEmpty({ message: `Income category name can't be empti` })
  readonly category_name: string;

  @ApiProperty({
    example: 700,
    description: 'Income sum is integer number',
  })
  @IsInt()
  @IsPositive()
  readonly income_sum: number;

  @ApiProperty({
    example: false,
    description: 'Is income transaction',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly is_transaction?: boolean;

  @ApiProperty({
    example: 42,
    description: 'From which user the transaction',
    required: false,
  })
  @IsOptional()
  @IsInt()
  readonly from_user_id?: number;
}
