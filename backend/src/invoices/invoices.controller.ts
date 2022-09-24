import { Controller, Get, ParseIntPipe, Post, Put } from '@nestjs/common';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiHeader } from '@nestjs/swagger';
import { InvoicesDto } from './dto/invoices.dto';
import { InvoicesService } from './invoices.service';

@ApiHeader({ name: 'authorization', description: 'must be token' })
@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post()
  create(@Body() invoice: InvoicesDto): Promise<InvoicesDto> {
    return this.invoicesService.createInvoice(invoice);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() invoice: InvoicesDto,
  ): Promise<InvoicesDto> {
    return this.invoicesService.updateInvoice(id, invoice);
  }

  @Get(':id')
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoicesDto> {
    return await this.invoicesService.getOneById(id);
  }

  @Get()
  async getAll() {
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
