import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateCostDto {
  @ApiProperty({ example: 'My cost', description: 'Cost name' })
  @IsNotEmpty({ message: `Cost name can't be empti` })
  readonly cost_name: string;

  @ApiProperty({
    example: 154,
    description: 'Cost sum is integer number',
  })
  @IsInt()
  @IsPositive()
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
