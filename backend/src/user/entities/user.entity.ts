import { ApiProperty } from '@nestjs/swagger';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { InvoiceEntity } from '../../invoices/entities/invoice.entity';
import { Base } from 'src/common/dto/base.dto';
import { IncomeEntity } from 'src/income/entities/income.entity';
import { CostEntity } from 'src/costs/entities/cost.entity';
import { Message } from 'src/messages/entities/message.entity';

@Entity('user')
export class UserEntity extends Base {
  @ApiProperty({ example: 'Doe', description: 'User name' })
  @Column({ type: 'varchar', length: 64 })
  firstName: string;

  @ApiProperty({ example: 'John', description: 'User surname' })
  @Column({ type: 'varchar', length: 64 })
  lastName: string;

  @ApiProperty({ example: 'johndoe@mail.com', description: 'User email' })
  @Column({ type: 'varchar', length: 320, unique: true, nullable: false })
  email: string;

  @ApiProperty({ example: 'Qwerty@12345', description: 'User password' })
  @Column()
  password: string;

  @ApiProperty({
    example: '27 Astronomichna street, Kharkiv, Ukraine',
    description: 'User address field',
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    example: '+380680802212',
    description: 'User phone number',
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ example: '2000-12-01', description: 'User birthdate' })
  @Column({ nullable: true, type: 'date' })
  birthdate: Date;

  @ApiProperty()
  @Column({ nullable: true })
  refreshTokenHash?: string;

  @ApiProperty()
  @Column({ default: '' })
  activationLink?: string;

  @ApiProperty()
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({
    example: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    description: 'User avatar',
  })
  @Column({ nullable: true })
  avatarPath: string;

  @ApiProperty()
  @OneToMany(() => WalletEntity, (wallet: WalletEntity) => wallet.owner, {
    onDelete: 'CASCADE',
  })
  wallets: WalletEntity[];

  @ApiProperty()
  @OneToMany(() => InvoiceEntity, (invoice) => invoice.id)
  invoice: InvoiceEntity;

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

  @ApiProperty()
  @ManyToMany(() => InvoiceEntity, (invoice) => invoice.displayForUsers)
  displayInvoices: InvoiceEntity[];

  @OneToMany(() => Message, (message) => message.author)
  @JoinColumn()
  messages: Message[];
}
