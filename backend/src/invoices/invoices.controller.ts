import {
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { InvoicesDto } from './dto/invoices.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post()
  async create(@Body() invoice: InvoicesDto): Promise<InvoicesDto> {
    return this.invoicesService.createInvoice(invoice);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() invoice: InvoicesDto,
  ): Promise<InvoicesDto> {
    return this.invoicesService.updateInvoice(id, invoice);
  }

  @Delete(':invoiceId/created-by/:id')
  async removeForCreatedUser(
    @Param('id') id: number,
    @Param('invoiceId') invoiceId: number,
  ): Promise<void> {
    return this.invoicesService.removeForCreatedUserInvoice(invoiceId, id);
  }

  @Delete(':invoiceId/billed-to/:id')
  async removeForBilledToUser(
    @Param('id') id: number,
    @Param('invoiceId') invoiceId: number,
  ): Promise<void> {
    return this.invoicesService.removeForBilledToUserInvoice(invoiceId, id);
  }

  @Get(':id')
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoicesDto> {
    return await this.invoicesService.getOneById(id);
  }

  @Get()
  async getAll(): Promise<InvoicesDto[]> {
    return this.invoicesService.getAllInvoices();
  }

  @Get('created-by/:id')
  async getAllCreated(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoicesDto[]> {
    return this.invoicesService.getAllCreatedByUser(id);
  }

  @Get('billed-to/:id')
  async getAllCreatedForUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoicesDto[]> {
    return this.invoicesService.getAllBilledToUser(id);
  }
}
