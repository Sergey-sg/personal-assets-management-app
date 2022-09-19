import { IsString, IsDate, } from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';
import { ItemDto } from './item.dto';

export class InvoicesDto {
    createdBy: UserEntity;
    
    billedTo: UserEntity;

    items: ItemDto[];

    @IsDate()
    dueDate: Date;

    @IsString()
    invoiceDetail: string;
}
