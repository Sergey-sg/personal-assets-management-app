import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../utils/DB/base';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IncomeEntity } from '../../income/entities/income.entity';
import { CostEntity } from '../../costs/entities/cost.entity';

@Entity('user')
export class UserEntity extends Base {
  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({ select: false })
  password?: string;

  @ApiProperty()
  @Column({ default: '' })
  lastName: string;

  @ApiProperty()
  @Column({ default: '' })
  firstName: string;

  @ApiProperty()
  @Column({ default: '' })
  refreshTokenHash?: string;

  @ApiProperty()
  @Column({ default: '' })
  activationLink?: string;

  @ApiProperty()
  @Column({ default: false, name: 'is_verify' })
  isVerified?: boolean;

  @ApiProperty()
  @Column({ default: '', name: 'avatar_path' })
  avatarPath?: string;

  @ApiProperty()
  @OneToMany(() => WalletEntity, (wallet: WalletEntity) => wallet.owner, {
    onDelete: 'CASCADE',
  })
  wallets: WalletEntity[];

  @ApiProperty()
  @OneToMany(
    () => IncomeEntity,
    (income_transaction: IncomeEntity) => income_transaction.from_user,
    {
      onDelete: 'CASCADE',
    },
  )
  income_transactions: IncomeEntity[];

  @ApiProperty()
  @OneToMany(
    () => CostEntity,
    (costs_transaction: CostEntity) => costs_transaction.to_user,
    {
      onDelete: 'CASCADE',
    },
  )
  costs_transactions: CostEntity[];
}
