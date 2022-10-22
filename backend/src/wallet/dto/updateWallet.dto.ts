import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateWalletDto {
  @ApiProperty({
    example: 'MyWallet',
    description: 'Wallet name',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Walletname can't be empti` })
  readonly wallet_name?: string;
}
