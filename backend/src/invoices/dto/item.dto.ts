import { IsNumber, IsString, IsDecimal, } from 'class-validator';
import { InvoicesDto } from './invoices.dto';

export class ItemDto {
    invoice: InvoicesDto;

    @IsString()
    name: string;
    
    @IsNumber()
    amount: number;

    @IsDecimal()
    price: number;
}
