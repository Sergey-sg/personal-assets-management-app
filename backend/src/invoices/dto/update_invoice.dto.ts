import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDateString,
  IsNumber,
  IsPositive,
  Max,
  IsInt,
  IsNotEmpty,
  ValidateNested,
  Min,
  IsOptional,
} from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';
import { InvoiceItemDto } from './invoiceItem.dto';
import { PartialType } from '@nestjs/mapped-types';
import { InvoicesDto } from './invoices.dto';

export class UpdateInvoicesDto extends PartialType(InvoicesDto) {
  @IsOptional()
  createdBy: UserEntity;

  @IsOptional()
  createdByRemove: boolean;

  @IsOptional()
  billedTo: UserEntity;

  @IsOptional()
  billedToRemove: boolean;

  @IsOptional()
  paid: boolean;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsOptional()
  @ApiProperty({
    example: '10',
    description: 'discount percentage',
  })
  @Min(0)
  @Max(100)
  @IsInt()
  discount: number;

  @IsOptional()
  @ApiProperty({
    example: '2022-09-30',
    description: 'end date for payment',
  })
  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @ApiProperty({
    example: '2022-09-30',
    description: 'billing date for payment',
  })
  @IsDateString()
  invoiceDate: Date;

  @IsOptional()
  @ApiProperty({
    example: 'Details of invoice',
    description: 'details of invoice',
  })
  @IsString()
  invoiceDetails: string;

  @IsOptional()
  @ApiProperty({
    example: '13500',
    description: 'total price of all items in invoice in coins',
  })
  @IsNumber()
  @IsPositive()
  total: number;
}
