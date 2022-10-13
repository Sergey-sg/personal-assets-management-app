import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceItemEntity } from './entities/invoiceItem.entity';
import { InvoiceItemDto } from './dto/invoiceItem.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,

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
        select: ['id', 'firstName', 'lastName', 'email', 'address', 'avatarPath']
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
    email: string,
    whereParams: object,
    relationsParams: object,
  ) { 
    const invoice = await this.invoiceRepository
      .findOneOrFail({
        where: whereParams,
        relations: relationsParams,
      })
      .catch(() => {
        throw new HttpException(
          `Invoice does not found for user: ${email}`,
          HttpStatus.NOT_FOUND,
        );
      });
    return invoice;
  }

  private validateTotalPrice(items: InvoiceItemDto[], discount: number, entryTotalPrice: number) {
    const subTotal = items.reduce(
      (total, item) => item.price * item.amount + total,
      0,
    );
    const total = (subTotal * (100 - discount)) / 100;
    if (total !== entryTotalPrice) {
      throw new HttpException(
        'total price is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async createInvoice(
    invoiceDto: InvoiceDto,
    currentUser: UserEntity,
  ): Promise<InvoiceEntity> {
    const billedTo = await this.getUser(invoiceDto.billedTo);
    this.validateTotalPrice(invoiceDto.items, invoiceDto.discount, invoiceDto.total);
    const newInvoice = this.invoiceRepository.create({
      ...invoiceDto,
      createdBy: currentUser,
      billedTo: billedTo,
      displayForUsers: [currentUser, billedTo],
    });
    return await this.invoiceRepository.save(newInvoice);
  }

  public async updateInvoice(
    invoiceId: number,
    invoiceDto: InvoiceDto,
    currentUser: UserEntity,
  ): Promise<InvoiceEntity> {
    const billedTo = await this.getUser(invoiceDto.billedTo);
    this.validateTotalPrice(invoiceDto.items, invoiceDto.discount, invoiceDto.total);
    const oldInvoice = await this.getInvoiceByIdForUser(
      currentUser.email,
      { id: invoiceId, createdBy: { id: currentUser.id }, displayForUsers: {id: currentUser.id} },
      {billedTo: true},
    );
    if (oldInvoice.paid) {
      throw new HttpException(
        'This invoice has already been paid for and its change is prohibited',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newInvoice = this.invoiceRepository.create({
      ...invoiceDto,
      id: invoiceId,
      billedTo: billedTo,
      displayForUsers: [currentUser, billedTo],
    });
    const oldItems = await this.itemRepository.find({
      select: {id: true},
      where: {invoice: { id: invoiceId }},
    });
    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        if (oldItems) {
          await entityManager
            .withRepository(this.itemRepository)
            .delete(oldItems.map((item) => item.id));
        }
        return await entityManager.withRepository(this.invoiceRepository).save(newInvoice);
      },
    );
  }

  public async removeInvoiceForUser(
    invoiceId: number,
    currentUser: UserEntity,
  ): Promise<void> {
    const invoice = await this.getInvoiceByIdForUser(
      currentUser.email,
      { id: invoiceId },
      {displayForUsers: true},
    );
    if (!invoice.displayForUsers.map(user => user.id).includes(currentUser.id)) {
      throw new HttpException(
        `Invoice does not found for user: ${currentUser.email}`,
        HttpStatus.NOT_FOUND,
      );
    }
    invoice.displayForUsers = invoice.displayForUsers.filter((user) => user.id !== currentUser.id);
    await this.invoiceRepository.save(invoice);
  }

  public async getOneById(
    invoiceId: number,
    currentUser: UserEntity,
  ): Promise<InvoiceDto> {
    return await this.getInvoiceByIdForUser(
      currentUser.email,
      { id: invoiceId, displayForUsers: {id: currentUser.id} },
      { items: true, createdBy: true, billedTo: true },
    );
  }

  public async getAllInvoicesForUser(currentUser: UserEntity) {
    return await this.invoiceRepository.find({
      where: [
        { displayForUsers: {id: currentUser.id} },
      ],
      relations: { items: true, createdBy: true, billedTo: true },
    });
  }

  public async findCustomerByParams(params: any) {
    const user = await this.userRepository.findAndCount({
      where: params,
      select: ['id', 'firstName', 'lastName', 'email', 'address', 'avatarPath']
    });

    if (user[1] === 0) {
      throw new HttpException(
        'User with these parameters not found.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user[1] > 1) {
      throw new HttpException(
        'You need to make a more precise request. This request is available to several users.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return user[0][0];
  }
}
