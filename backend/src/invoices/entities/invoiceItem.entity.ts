import { Base } from '../../utils/DB/base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { InvoicesEntity } from './invoices.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('invoice_item')
export class InvoiceItemEntity extends Base {
  @ManyToOne(() => InvoicesEntity, (invoice) => invoice.items)
  invoice: InvoicesEntity;

  @ApiProperty({ description: 'item name' })
  @Column({ type: 'varchar', length: 300 })
  name: string;

  @ApiProperty({ description: 'quantity of items' })
  @Column({ type: 'int', default: 0 })
  amount: number;

  @ApiProperty({ description: 'price of item' })
  @Column({ type: 'int', default: 0 })
  price: number;

  @ApiProperty({ description: 'total price of items' })
  @Column({ type: 'int', default: 0 })
  subTotal: number;
}
