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
import { InvoicesDto } from './dto/invoices.dto';
import { InvoicesEntity } from './entities/invoices.entity';
import { InvoicesService } from './invoices.service';
import { User } from '../user/decorators/user.decorator';

@ApiTags('Invoices')
@UseGuards(AccessTokenGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a invoice with invoice items' })
  @ApiResponse({ status: HttpStatus.CREATED, type: InvoicesEntity })
  async create(
    @User('id') currentUserId: number,
    @Body() invoice: InvoicesDto,
  ): Promise<InvoicesDto> {
    console.log(invoice);
    return this.invoicesService.createInvoice(invoice, currentUserId);
  }

  @Get()
  @ApiOperation({ summary: `Get all invoices` })
  @ApiResponse({ status: HttpStatus.OK, type: [InvoicesEntity] })
  async getAllInvoices(
    @User('id') currentUserId: number,
  ): Promise<InvoicesDto[]> {
    return this.invoicesService.getAllInvoicesForUser(currentUserId);
  }

  @Put(':id')
  @ApiOperation({ summary: `Update invoice` })
  @ApiResponse({ status: HttpStatus.CREATED, type: InvoicesEntity })
  async update(
    @User('id') currentUserId: number,
    @Param('id') invoiceId: number,
    @Body() invoice: InvoicesDto,
  ): Promise<InvoicesDto> {
    return this.invoicesService.updateInvoice(
      invoiceId,
      invoice,
      currentUserId,
    );
  }

  @Delete(':invoiceId/created-by')
  @ApiOperation({ summary: `deletes the order from the creator` })
  async removeForCreator(
    @User('id') currentUserId: number,
    @Param('invoiceId') invoiceId: number,
  ): Promise<void> {
    return this.invoicesService.removeInvoiceForCreator(
      invoiceId,
      currentUserId,
    );
  }

  @Delete(':invoiceId/billed-to')
  @ApiOperation({ summary: `deletes the order from the customer` })
  async removeForCustomer(
    @User('id') currentUserId: number,
    @Param('invoiceId') invoiceId: number,
  ): Promise<void> {
    return this.invoicesService.removeInvoiceForCustomer(
      invoiceId,
      currentUserId,
    );
  }

  @Get(':id/created-by')
  @ApiOperation({ summary: `Get one invoice by id for creator` })
  @ApiResponse({ status: HttpStatus.OK, type: InvoicesEntity })
  async getOneByIdForCreator(
    @User('id') currentUserId: number,
    @Param('id', ParseIntPipe) invoiceId: number,
  ): Promise<InvoicesDto> {
    return await this.invoicesService.getOneByIdForCreator(
      invoiceId,
      currentUserId,
    );
  }

  @Get(':id/billed-to')
  @ApiOperation({ summary: `Get one invoice by id for customer` })
  @ApiResponse({ status: HttpStatus.OK, type: InvoicesEntity })
  async getOneByIdForCustomer(
    @User('id') currentUserId: number,
    @Param('id', ParseIntPipe) invoiceId: number,
  ): Promise<InvoicesDto> {
    return await this.invoicesService.getOneByIdForCustomer(
      invoiceId,
      currentUserId,
    );
  }

  @Get('created-by')
  @ApiOperation({ summary: `Get all invoices for creator` })
  @ApiResponse({ status: HttpStatus.OK, type: [InvoicesEntity] })
  async getAllCreated(
    @User('id') currentUserId: number,
  ): Promise<InvoicesDto[]> {
    return this.invoicesService.getAllCreatedByUser(currentUserId);
  }

  @Get('billed-to')
  @ApiOperation({ summary: `Get all invoices for customer` })
  @ApiResponse({ status: HttpStatus.OK, type: [InvoicesEntity] })
  async getAllCreatedForUser(
    @User('id') currentUserId: number,
  ): Promise<InvoicesDto[]> {
    return this.invoicesService.getAllBilledToUser(currentUserId);
  }
}
