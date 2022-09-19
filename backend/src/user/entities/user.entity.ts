import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../utils/DB/base';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { InvoicesEntity } from 'src/invoices/entities/invoices.entity';

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

  @OneToMany(() => WalletEntity, (wallet) => wallet.userWallet)
  wallet?: WalletEntity[];

  @OneToMany(() => InvoicesEntity, (invoice) => invoice.id)
  invoice: InvoicesEntity;
}
