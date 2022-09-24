import { Base } from '../../utils/DB/base';
import { UserEntity } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { ItemEntity } from './item.entity';

@Entity('invoices')
export class InvoicesEntity extends Base {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  billedTo: UserEntity;

  @OneToMany(() => ItemEntity, (item) => item.invoice, {
    cascade: true,
    nullable: true,
  })
  items: ItemEntity[];

  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @Column({ default: 1 })
  discount: number;

  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  invoiceDate: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  invoiceDetail: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;
}
