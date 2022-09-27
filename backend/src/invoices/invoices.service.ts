import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InvoicesDto } from './dto/invoices.dto';
import { InvoicesEntity } from './entities/invoices.entity';
import { InvoiceItemEntity } from './entities/invoiceItem.entity';
import { InvoiceItemDto } from './dto/invoiceItem.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoicesEntity)
    private invoiceRepository: Repository<InvoicesEntity>,

    @InjectRepository(InvoiceItemEntity)
    private itemRepository: Repository<InvoiceItemEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private dataSource: DataSource,
  ) {}

  private async getUser(user: any) {
    const currentUser = await this.userRepository
      .findOneOrFail({
        where: user,
      })
      .catch(() => {
        throw new HttpException(
          user.email
            ? `User with email: ${user.email} does not exist`
            : `User with id: ${user.id} does not exist`,
          HttpStatus.BAD_REQUEST,
        );
      });
    return currentUser;
  }

  private async getInvoiceByIdForUser(
    invoiceId: number,
    user: any,
    creator: boolean,
    relationsParams: object,
  ) {
    const whereParams = creator
      ? { id: invoiceId, createdBy: { id: user.id }, createdByRemove: false }
      : { id: invoiceId, billedTo: { id: user.id }, billedToRemove: false };
    const invoice = await this.invoiceRepository
      .findOneOrFail({
        where: whereParams,
        relations: relationsParams,
      })
      .catch(() => {
        throw new HttpException(
          user.email
            ? `Invoice does not found for user: ${user.email}`
            : `Invoice does not found for user: ${user.id}`,
          HttpStatus.NOT_FOUND,
        );
      });
    return invoice;
  }

  private async getArreyOfNewItems(
    items: InvoiceItemDto[],
    invoice: InvoicesDto,
  ) {
    const newItems = [];
    items.forEach((item) => {
      const newInvoiceItem = this.itemRepository.create({
        invoice: invoice,
        name: item.name,
        amount: item.amount,
        price: item.price,
        subTotal: item.subTotal,
      });
      newItems.push(newInvoiceItem);
    });
    return newItems;
  }

  public async createInvoice(
    invoicesDto: InvoicesDto,
    currentUserId: number,
  ): Promise<InvoicesEntity> {
    try {
      const createdBy = await this.getUser({ id: currentUserId });
      const billedTo = await this.getUser(invoicesDto.billedTo);
      const subTotal = invoicesDto.items.reduce(
        (total, item) => item.price * item.amount + total,
        0,
      );
      const total = (subTotal * (100 - invoicesDto.discount)) / 100;
      if (total === invoicesDto.total) {
        const newInvoice = this.invoiceRepository.create({
          createdBy: createdBy,
          billedTo: billedTo,
          dueDate: invoicesDto.dueDate,
          invoiceDate: invoicesDto.invoiceDate,
          invoiceDetails: invoicesDto.invoiceDetails,
          discount: invoicesDto.discount,
          total: invoicesDto.total,
        });
        return await this.dataSource.transaction(
          async (entityManager: EntityManager) => {
            await entityManager
              .withRepository(this.invoiceRepository)
              .insert(newInvoice);
            const newInvoiceItems = await this.getArreyOfNewItems(
              invoicesDto.items,
              newInvoice,
            );
            await entityManager
              .withRepository(this.itemRepository)
              .insert(newInvoiceItems);
            return newInvoice;
          },
        );
      } else {
        throw new HttpException(
          'total price is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateInvoice(
    id: number,
    invoicesDto: InvoicesDto,
    currentUserId: number,
  ): Promise<InvoicesEntity> {
    try {
      const createdBy = await this.getUser({ id: currentUserId });
      const billedTo = await this.getUser(invoicesDto.billedTo);
      const oldInvoice = await this.getInvoiceByIdForUser(
        id,
        createdBy,
        true,
        {},
      );
      if (oldInvoice.paid) {
        throw new HttpException(
          'This invoice has already been paid for and its change is prohibited',
          HttpStatus.BAD_REQUEST,
        );
      }
      const oldItems = await this.itemRepository.findBy({
        invoice: { id: id },
      });
      oldInvoice.billedTo = billedTo;
      oldInvoice.dueDate = invoicesDto.dueDate;
      oldInvoice.invoiceDate = invoicesDto.invoiceDate;
      oldInvoice.invoiceDetails = invoicesDto.invoiceDetails;
      oldInvoice.total = invoicesDto.total;
      return await this.dataSource.transaction(
        async (entityManager: EntityManager) => {
          if (oldItems) {
            await entityManager
              .withRepository(this.itemRepository)
              .delete(oldItems.map((item) => item.id));
          }
          const newInvoiceItems = await this.getArreyOfNewItems(
            invoicesDto.items,
            oldInvoice,
          );
          await entityManager
            .withRepository(this.itemRepository)
            .insert(newInvoiceItems);
          await entityManager
            .withRepository(this.invoiceRepository)
            .update(id, oldInvoice);
          return oldInvoice;
        },
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async removeInvoiceForCreator(
    invoiceId: number,
    currentUserId: number,
  ): Promise<void> {
    try {
      const createdBy = await this.getUser({ id: currentUserId });
      const invoice = await this.getInvoiceByIdForUser(
        invoiceId,
        createdBy,
        true,
        {},
      );
      invoice.createdByRemove = true;
      await this.invoiceRepository.update(invoiceId, invoice);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  public async removeInvoiceForCustomer(
    invoiceId: number,
    currentUserId: number,
  ): Promise<void> {
    try {
      const billedTo = await this.getUser({ id: currentUserId });
      const invoice = await this.getInvoiceByIdForUser(
        invoiceId,
        billedTo,
        false,
        {},
      );
      invoice.billedToRemove = true;
      await this.invoiceRepository.update(invoiceId, invoice);
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  public async getOneByIdForCreator(
    invoiceId: number,
    currentUserId: number,
  ): Promise<InvoicesDto> {
    return await this.getInvoiceByIdForUser(
      invoiceId,
      { id: currentUserId },
      true,
      { items: true, billedTo: true },
    );
  }

  public async getOneByIdForCustomer(
    invoiceId: number,
    currentUserId: number,
  ): Promise<InvoicesDto> {
    return await this.getInvoiceByIdForUser(
      invoiceId,
      { id: currentUserId },
      false,
      { items: true, createdBy: true },
    );
  }

  public async getAllInvoicesForUser(currentUserId: number) {
    return await this.invoiceRepository.find({
      where: [
        { createdBy: { id: currentUserId }, createdByRemove: false },
        { billedTo: { id: currentUserId }, billedToRemove: false },
      ],
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
