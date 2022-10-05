import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { Base } from 'src/common/dto/base.dto';

@Entity('income')
export class IncomeEntity extends Base {
  @ApiProperty({ example: 'My income', description: 'Income category name' })
  @Column({ type: 'varchar', length: 50 })
  category_name: string;

  @ApiProperty({
    example: 555,
    description: 'Income sum is integer or decimal number',
  })
  @Column({ type: 'int', default: 0 })
  income_sum: number;

  @ApiProperty({ example: null, description: 'Is income transaction' })
  @Column({ type: 'bool', default: false })
  is_transaction: boolean;

  @ManyToOne(
    () => UserEntity,
    (from_user: UserEntity) => from_user.income_transactions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'from_user_id' })
  from_user: UserEntity;

  @ApiProperty({
    example: '2022-09-07T11:44:17.300Z',
    description: 'Income create date',
  })
  @ApiProperty({ example: null, description: 'Income alternative date' })
  @Column({ type: 'date', default: null, nullable: true })
  alternative_date: Date;

  @ManyToOne(() => WalletEntity, (wallet: WalletEntity) => wallet.income, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;
}
