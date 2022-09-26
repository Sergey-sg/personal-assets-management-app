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
import { InvoiceItemDto } from './dto/invoiceItem.dto';
import { InvoicesDto } from './dto/invoices.dto';
import { InvoicesEntity } from './entities/invoices.entity';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices')
@UseGuards(AccessTokenGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @ApiOperation({ summary: 'Create a invoice with invoice items' })
  @ApiResponse({ status: HttpStatus.CREATED, type: InvoicesEntity })
  @Post()
  async create(@Body() invoice: InvoicesDto): Promise<InvoicesDto> {
    return this.invoicesService.createInvoice(invoice);
  }

  @ApiOperation({ summary: `Update invoice` })
  @ApiResponse({ status: HttpStatus.CREATED, type: InvoicesEntity })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() invoice: InvoicesDto,
  ): Promise<InvoicesDto> {
    return this.invoicesService.updateInvoice(id, invoice);
  }

  @ApiOperation({ summary: `deletes the order from the creator` })
  @Delete(':invoiceId/created-by/:id')
  async removeForCreator(
    @Param('id') id: number,
    @Param('invoiceId') invoiceId: number,
  ): Promise<void> {
    return this.invoicesService.removeInvoiceForCreator(invoiceId, id);
  }

  @ApiOperation({ summary: `deletes the order from the customer` })
  @Delete(':invoiceId/billed-to/:id')
  async removeForCustomer(
    @Param('id') id: number,
    @Param('invoiceId') invoiceId: number,
  ): Promise<void> {
    return this.invoicesService.removeInvoiceForCustomer(invoiceId, id);
  }

  @ApiOperation({ summary: `Get one invoice by id` })
  @ApiResponse({ status: HttpStatus.OK, type: InvoicesEntity })
  @Get(':id')
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoicesDto> {
    return await this.invoicesService.getOneById(id);
  }

  @ApiOperation({ summary: `Get all invoices` })
  @ApiResponse({ status: HttpStatus.OK, type: [InvoicesEntity] })
  @Get()
  async getAll(): Promise<InvoicesDto[]> {
    return this.invoicesService.getAllInvoices();
  }

  @ApiOperation({ summary: `Get all invoices for creator` })
  @ApiResponse({ status: HttpStatus.OK, type: [InvoicesEntity] })
  @Get('created-by/:id')
  async getAllCreated(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoicesDto[]> {
    return this.invoicesService.getAllCreatedByUser(id);
  }

  @ApiOperation({ summary: `Get all invoices for customer` })
  @ApiResponse({ status: HttpStatus.OK, type: [InvoicesEntity] })
  @Get('billed-to/:id')
  async getAllCreatedForUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoicesDto[]> {
    return this.invoicesService.getAllBilledToUser(id);
  }
}
