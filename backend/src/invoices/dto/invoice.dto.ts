import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsPositive,
  Max,
  IsInt,
  IsNotEmpty,
  ValidateNested,
  Min,
  IsOptional,
  IsDate
} from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';
import { InvoiceItemDto } from './invoiceItem.dto';

export class InvoiceDto {
  @IsNotEmpty()
  billedTo: UserEntity;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @ApiProperty({
    example: '10',
    description: 'discount percentage',
  })
  @IsOptional()
  @Min(0)
  @Max(100)
  @IsInt()
  discount: number;

  @ApiProperty({
    example: '2022-09-30',
    description: 'end date for payment',
  })
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    example: '2022-09-30',
    description: 'billing date for payment',
  })
  @Type(() => Date)
  @IsDate()
  invoiceDate: Date;

  @ApiProperty({
    example: 'Details of invoice',
    description: 'details of invoice',
  })
  @IsString()
  invoiceDetails: string;

  @ApiProperty({
    example: '13500',
    description: 'total price of all items in invoice in coins',
  })
  @IsInt()
  @IsPositive()
  total: number;
}
