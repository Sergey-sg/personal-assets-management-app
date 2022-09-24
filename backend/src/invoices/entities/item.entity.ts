import { Base } from '../../utils/DB/base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { InvoicesEntity } from './invoices.entity';

@Entity('item')
export class ItemEntity extends Base {
  @ManyToOne(() => InvoicesEntity, (invoice) => invoice.items)
  invoice: InvoicesEntity;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subTotal: number;
}
