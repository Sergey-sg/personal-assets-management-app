import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { BaseForCrypto } from 'src/common/dto/baseForCrypto.dto';
import { CryptoPortfolioEntity } from 'src/crypto/cryptoPortfolio/entities/cryptoPortfolio.entity';

import { Column, Entity, OneToOne } from 'typeorm';

@Entity('cryptoStatistics')
export class CryptoStatisticsEntity extends BaseForCrypto {
  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  one_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  two_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  three_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  four_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  five_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  six_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  seven_day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  change1day?: number;

  @ApiProperty()
  @Column({ default: 0, type: 'decimal' })
  counterDay?: number;

  @ApiProperty()
  @IsString()
  @Column({ name: 'changes_7_day', default: 0, type: 'decimal' })
  changes7Day?: number;

  @ApiProperty()
  @IsString()
  @Column({ name: 'changes_30_day', default: 0, type: 'decimal' })
  changes30Day?: string;

  @OneToOne(
    () => CryptoPortfolioEntity,
    (owner_crypto_wallet: CryptoPortfolioEntity) =>
      owner_crypto_wallet.statistics,
  )
  owner_crypto_wallet?: CryptoPortfolioEntity;
}
