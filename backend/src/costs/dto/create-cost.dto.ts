import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateCostDto {
  @ApiProperty({ example: 'My cost', description: 'Cost name' })
  @IsNotEmpty({ message: `Cost name can't be empti` })
  readonly cost_name: string;

  @ApiProperty({
    example: 154.5,
    description: 'Cost sum is integer or decimal number',
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Cost sum could be integer or decimal number' },
  )
  @Min(0.01, { message: 'Sum must be greater than 0' })
  readonly cost_sum: number;

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
    description: 'To which user the transaction',
    required: false,
  })
  @IsOptional()
  @IsInt()
  readonly to_user_id?: number;
}
