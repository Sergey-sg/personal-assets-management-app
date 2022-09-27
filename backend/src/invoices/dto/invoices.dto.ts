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
} from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { InvoiceItemDto } from './invoiceItem.dto';

export class InvoicesDto {
  @IsOptional()
  createdBy: UserEntity;

  createdByRemove: boolean;

  @IsOptional()
  billedTo: CreateUserDto;

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
  })
  @IsOptional()
  dueDate: Date;

  @ApiProperty({
    example: '2022-09-30',
    description: 'billing date for payment',
  })
  @IsOptional()
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
