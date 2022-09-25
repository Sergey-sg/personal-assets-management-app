import { IsString, IsDateString } from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';
import { ItemDto } from './item.dto';

export class InvoicesDto {
  createdBy: UserEntity;

  createdByRemove: boolean;

  billedTo: UserEntity;

  billedToRemove: boolean;

  items: ItemDto[];

  paid: boolean;

  discount: number;

  @IsDateString()
  dueDate: Date;

  @IsDateString()
  invoiceDate: Date;

  @IsString()
  invoiceDetail: string;

  total: number;
}
