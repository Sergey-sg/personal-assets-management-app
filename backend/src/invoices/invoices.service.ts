import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InvoicesDto } from './dto/invoices.dto';
import { InvoicesEntity } from './entities/invoices.entity';
import { ItemEntity } from './entities/item.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoicesEntity)
    private invoiceRepository: Repository<InvoicesEntity>,

    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async createInvoice(
    invoicesDto: InvoicesDto,
  ): Promise<InvoicesEntity> {
    const createdBy = await this.userRepository.findOneOrFail({
      where: invoicesDto.createdBy,
    });
    const billedTo = await this.userRepository.findOneOrFail({
      where: invoicesDto.billedTo,
    });
    const newInvoice = await this.invoiceRepository.save({
      createdBy: createdBy,
      billedTo: billedTo,
      dueDate: invoicesDto.dueDate,
      invoiceDate: invoicesDto.invoiceDate,
      invoiceDetail: invoicesDto.invoiceDetail,
      total: invoicesDto.total,
    });
    invoicesDto.items.forEach((item) =>
      this.itemRepository.save({
        invoice: newInvoice,
        name: item.name,
        amount: item.amount,
        price: item.price,
        subTotal: item.subTotal,
      }),
    );
    return newInvoice;
  }

  public async updateInvoice(
    id: number,
    invoicesDto: InvoicesDto,
  ): Promise<InvoicesEntity> {
    try {
      const createdBy = await this.userRepository.findOneOrFail({
        where: invoicesDto.createdBy,
      });
      const oldInvoice = await this.invoiceRepository.findOneOrFail({
        where: { id: id, createdBy: { id: createdBy.id } },
      });
      const billedTo = await this.userRepository.findOneOrFail({
        where: invoicesDto.billedTo,
      });
      await this.invoiceRepository.update(id, {
        billedTo: billedTo,
        dueDate: invoicesDto.dueDate,
        invoiceDate: invoicesDto.invoiceDate,
        invoiceDetail: invoicesDto.invoiceDetail,
        total: invoicesDto.total,
      });
      const updatedInvoice = await this.invoiceRepository.findOneBy({ id: id });
      const oldItems = await this.itemRepository.find({
        where: { invoice: { id: updatedInvoice.id } },
      });
      oldItems.forEach((item) => {
        this.itemRepository.delete({ id: item.id });
      });
      invoicesDto.items.forEach((item) =>
        this.itemRepository.save({
          invoice: updatedInvoice,
          name: item.name,
          amount: item.amount,
          price: item.price,
          subTotal: item.subTotal,
        }),
      );
      return updatedInvoice;
    } catch (e) {
      throw new HttpException(
        `Invoice does not found for user: ${invoicesDto.createdBy.email}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  public async removeForCreatedUserInvoice(
    invoiceId: number,
    id: number,
  ): Promise<void> {
    try {
      const createdBy = await this.userRepository.findOneByOrFail({ id: id });
      await this.invoiceRepository.findOneByOrFail({
        id: invoiceId,
        createdBy: { id: createdBy.id },
      });
      await this.invoiceRepository.update(invoiceId, { createdByRemove: true });
    } catch (e: any) {
      throw new HttpException(
        `Invoice does not found for user: ${e.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  public async removeForBilledToUserInvoice(
    invoiceId: number,
    id: number,
  ): Promise<void> {
    try {
      const billedTo = await this.userRepository.findOneByOrFail({ id: id });
      await this.invoiceRepository.findOneByOrFail({
        id: invoiceId,
        billedTo: { id: billedTo.id },
      });
      await this.invoiceRepository.update(invoiceId, { billedToRemove: true });
    } catch (e: any) {
      throw new HttpException(
        `Invoice does not found ${e.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  public async getAllInvoices() {
    return await this.invoiceRepository.find({
      relations: { items: true, createdBy: true, billedTo: true },
    });
  }

  public async getOneById(id: number): Promise<InvoicesDto> {
    return await this.invoiceRepository.findOne({
      where: { id: id },
      relations: { items: true, createdBy: true, billedTo: true },
    });
  }

  public async getAllCreatedByUser(id: number): Promise<InvoicesDto[]> {
    return await this.invoiceRepository.find({
      where: { createdBy: { id: id }, createdByRemove: false },
      relations: { items: true, billedTo: true },
    });
  }

  public async getAllBilledToUser(id: number): Promise<InvoicesDto[]> {
    return await this.invoiceRepository.find({
      where: { billedTo: { id: id }, billedToRemove: false },
      relations: { items: true, createdBy: true },
    });
  }
}
