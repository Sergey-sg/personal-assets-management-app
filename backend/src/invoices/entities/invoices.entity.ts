import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { InvoiceItemEntity } from './invoiceItem.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/dto/base.dto';

@Entity('invoices')
export class InvoicesEntity extends Base {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  createdBy: UserEntity;

  @ApiProperty({ description: 'creator delete invoice flag' })
  @Column({ type: 'boolean', default: false })
  createdByRemove: boolean;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  billedTo: UserEntity;

  @ApiProperty({ description: 'customer delete invoice flag' })
  @Column({ type: 'boolean', default: false })
  billedToRemove: boolean;

  @OneToMany(() => InvoiceItemEntity, (item) => item.invoice, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: InvoiceItemEntity[];

  @ApiProperty({ description: 'payment flag' })
  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @ApiProperty({ description: 'discount' })
  @Column({ type: 'int', default: 0 })
  discount: number;

  @ApiProperty({ description: 'due date' })
  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @ApiProperty({ description: 'invoice date' })
  @Column({ type: 'timestamptz', nullable: true })
  invoiceDate: Date;

  @ApiProperty({ description: 'invoice details' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  invoiceDetails: string | null;

  @ApiProperty({ description: 'total invoice price' })
  @Column({ type: 'int', default: 0 })
  total: number;
}
