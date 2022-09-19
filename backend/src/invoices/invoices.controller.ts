import { Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { InvoicesDto } from './dto/invoices.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
    constructor(private invoicesService: InvoicesService){}

    @Post()
    create(@Body() invoice: InvoicesDto): Promise<InvoicesDto> {
        return this.invoicesService.createInvoice(invoice);
    }

    @Get(":id")
    async getOneById(@Param('id', ParseIntPipe) id: number): Promise<InvoicesDto> {
        return await this.invoicesService.getOneById(id);
    }

    @Get()
    async getAll(): Promise<InvoicesDto[]> {
        return this.invoicesService.getAllInvoices();
    }

    @Get("created/:id")
    async getAllCreated(@Param('id', ParseIntPipe) id: number): Promise<InvoicesDto[]> {
        return this.invoicesService.getAllCreated(id);
    }

    @Get("created-for/:id")
    async getAllCreatedForUser(@Param('id', ParseIntPipe) id: number): Promise<InvoicesDto[]> {
        return this.invoicesService.getAllCreatedForUser(id);
    }
}