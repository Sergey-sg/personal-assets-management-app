import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPositive, IsInt } from 'class-validator';

export class InvoiceItemDto {
  @ApiProperty({
    example: 'Phone 10x lite',
    description: 'item name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '5',
    description: 'quantity of item',
  })
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: '15000',
    description: 'price of item in coins',
  })
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: '75000',
    description: 'total price of items in coins',
  })
  @IsInt()
  @IsPositive()
  subTotal: number;
}
