import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPositive, IsInt } from 'class-validator';
import { InvoicesDto } from './invoices.dto';

export class InvoiceItemDto {
  invoice: InvoicesDto;

  @ApiProperty({
    example: 'Phone 10x lite',
    description: 'item name',
    required: false,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '5',
    description: 'quantity of item',
    required: false,
  })
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: '15000',
    description: 'price of item in coins',
    required: false,
  })
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: '75000',
    description: 'total price of items in coins',
    required: false,
  })
  @IsInt()
  @IsPositive()
  subTotal: number;
}
