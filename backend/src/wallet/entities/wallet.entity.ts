import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../utils/DB/base';
import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('wallet')
export class WalletEntity extends Base {
  @ApiProperty()
  @Column({ unique: true })
  name?: string;

  @ApiProperty()
  @Column({ select: false })
  sum: number;

  @ManyToOne(() => UserEntity, (user) => user.wallet)
  userWallet: UserEntity;
  // @OneToMany(() => WalletEntity, (wallet) => wallet.wallets)
  // wallets: WalletEntity[];

  // @OneToMany(() => NotesEntity, (note) => note.notes)
  // note: NotesEntity[];
}
