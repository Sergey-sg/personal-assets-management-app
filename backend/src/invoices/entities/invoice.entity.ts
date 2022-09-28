import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { InvoiceItemEntity } from './invoiceItem.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/dto/base.dto';

@Entity('invoices')
export class InvoiceEntity extends Base {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  billedTo: UserEntity;

  @ApiProperty()
  @OneToMany(() => InvoiceItemEntity, (item) => item.invoice, {
    nullable: true,
    cascade: true,
    eager: true,
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

  @ApiProperty()
  @ManyToMany(() => UserEntity, (user) => user.displayInvoices, {
    cascade: true,
  })
  @JoinTable({
    name: "user_invoices", // table name for the junction table of this relation
    joinColumn: {
        name: "invoice",
        referencedColumnName: "id"
    },
    inverseJoinColumn: {
        name: "user",
        referencedColumnName: "id"
    }
})
  displayForUsers: UserEntity[];
}
