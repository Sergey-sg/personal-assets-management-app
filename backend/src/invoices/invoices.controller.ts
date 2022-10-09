import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoicesService } from './invoices.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from 'src/user/decorators/user.decorator';

@ApiTags('Invoices')
@UseGuards(AccessTokenGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a invoice with invoice items' })
  @ApiResponse({ status: HttpStatus.CREATED, type: InvoiceEntity })
  async create(
    @User() currentUser: UserEntity,
    @Body() invoice: InvoiceDto,
  ): Promise<InvoiceDto> {
    return this.invoicesService.createInvoice(invoice, currentUser);
  }

  @Get()
  @ApiOperation({ summary: `Get all invoices` })
  @ApiResponse({ status: HttpStatus.OK, type: [InvoiceEntity] })
  async getAllInvoices(
    @User() currentUser: UserEntity,
  ): Promise<InvoiceDto[]> {
    return this.invoicesService.getAllInvoicesForUser(currentUser);
  }

  @Get('/:invoiceId')
  @ApiOperation({ summary: `Get one invoice by id for creator` })
  @ApiResponse({ status: HttpStatus.OK, type: InvoiceEntity })
  async getOneById(
    @User() currentUser: UserEntity,
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
  ): Promise<InvoiceDto> {
    return await this.invoicesService.getOneById(
      invoiceId,
      currentUser,
    );
  }

  @Put('/:invoiceId')
  @ApiOperation({ summary: `Update invoice` })
  @ApiResponse({ status: HttpStatus.CREATED, type: InvoiceEntity })
  async update(
    @User() currentUser: UserEntity,
    @Param('invoiceId') invoiceId: number,
    @Body() invoice: InvoiceDto,
  ): Promise<InvoiceDto> {
    return this.invoicesService.updateInvoice(
      invoiceId,
      invoice,
      currentUser,
    );
  }

  @Delete('/:invoiceId')
  @ApiOperation({ summary: `deletes the order from the creator` })
  async removeInvoice(
    @User() currentUser: UserEntity,
    @Param('invoiceId') invoiceId: number,
  ): Promise<void> {
    return this.invoicesService.removeInvoiceForUser(
      invoiceId,
      currentUser,
    );
  }
}
