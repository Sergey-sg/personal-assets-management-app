import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min, Max, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateWalletLimitDto {
  @ApiProperty({ example: 5000, description: 'Amount costs for target duration' })
  @IsNotEmpty({ message: `wallet_limit can't be empty. For disable set 0` })
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Min(0)
  @Max(100000)
  readonly wallet_limit: number;

  @ApiProperty({ example: 30, description: 'Amount of days for sum costs' })
  @IsNotEmpty({ message: `wallet_duration can't be empty. For disable set 0` })
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Min(0)
  @Max(1000)
  readonly wallet_duration: number;
}
