import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDateString,
  IsNumber,
  IsPositive,
  Max,
  IsInt,
  IsNotEmptyObject,
  IsNotEmpty,
  ValidateNested,
  Min,
} from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';
import { InvoiceItemDto } from './invoiceItem.dto';

export class InvoicesDto {
  createdBy: UserEntity;

  createdByRemove: boolean;

  billedTo: UserEntity;

  billedToRemove: boolean;

  paid: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @ApiProperty({
    example: '10',
    description: 'discount percentage',
    required: false,
  })
  @Min(0)
  @Max(100)
  @IsInt()
  discount: number;

  @ApiProperty({
    example: '2022-09-30',
    description: 'end date for payment',
    required: false,
  })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({
    example: '2022-09-30',
    description: 'billing date for payment',
    required: false,
  })
  @IsDateString()
  invoiceDate: Date;

  @ApiProperty({
    example: 'Details of invoice',
    description: 'details of invoice',
    required: false,
  })
  @IsString()
  invoiceDetails: string;

  @ApiProperty({
    example: '13500',
    description: 'total price of all items in invoice in coins',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  total: number;
}
