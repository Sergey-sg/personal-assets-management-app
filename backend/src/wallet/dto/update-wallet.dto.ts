import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { WalletCurrency } from '../enums/wallet-currency.enum';

export class UpdateWalletDto {
  @ApiProperty({
    example: 'MyWallet',
    description: 'Wallet name',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Walletname can't be empti` })
  readonly wallet_name?: string;

  @ApiProperty({
    example: 'UAH',
    description: 'Wallet currency',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: `Currency can't be empti` })
  @IsEnum(WalletCurrency, {
    message: `Currency should match ${WalletCurrency.UAH}|${WalletCurrency.EUR}|${WalletCurrency.USD}`,
  })
  readonly currency?: WalletCurrency;
}
