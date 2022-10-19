import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Between, DataSource, EntityManager, ILike, In, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceItemEntity } from './entities/invoiceItem.entity';
import { InvoiceItemDto } from './dto/invoiceItem.dto';
import { PageOptionsDto } from 'src/pagination/dto/pageOptionsDto';
import { PageDto } from 'src/pagination/dto/page.dto';
import { PageMetaDto } from 'src/pagination/dto/page-meta.dto';
import { UpdateInvoiceDto } from './dto/updateInvoice.dto';

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
    whereParams: object,
    relationsParams: object,
  ) { 
    const paramsUserSelect = {id: true, firstName: true, lastName: true, email: true, address: true, avatarPath: true};
    const invoice = await this.invoiceRepository
      .findOneOrFail({
        where: whereParams,
        relations: relationsParams,
        select: {createdBy: paramsUserSelect, billedTo: paramsUserSelect}
      })
      .catch(() => {
        throw new HttpException(
          'Invoice does not found for user',
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

  private getParamsForFilters(filters: any) {
    const params = {};
    if (filters.search) {
      if (parseInt(filters.search)) {
        params['id'] = In([filters.search]);
      } else if (filters.search.includes('@')) {
        params['billedTo'] = {email: ILike(filters.search)};
      } else {
        params['billedTo'] = [{firstName: ILike(In(filters.search.split(' ')))}, {lastName: ILike(In(filters.search.split(' ')))}];
      }
    }
    if (filters.minDate || filters.maxDate) {
      const minDate = filters.minDate? new Date(filters.minDate) : new Date('1990-01-01')
      const maxDate = filters.maxDate? new Date(filters.maxDate) : new Date('2090-01-01') 
      params['invoiceDate'] = Between(minDate, maxDate);
    }
    if (filters.minPrice || filters.maxPrice) {
      params['total'] = Between(filters.minPrice? parseInt(filters.minPrice) : 0, filters.maxPrice? parseInt(filters.maxPrice) : 1000000000);
    }
    if (filters.status) {
      switch(filters.status) {
        case 'paid':
          params['paid'] = true;
          break;
        case 'unpaid':
          params['dueDate'] = LessThanOrEqual(new Date);
          params['paid'] = false;
          break;
        case 'pending':
          params['dueDate'] = MoreThanOrEqual(new Date);
          params['paid'] = false; 
          break;
      }
    }
    return params;
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
    invoiceDto: UpdateInvoiceDto,
    currentUser: UserEntity,
  ): Promise<InvoiceEntity> {
    const billedTo = await this.getUser(invoiceDto.billedTo);
    this.validateTotalPrice(invoiceDto.items, invoiceDto.discount, invoiceDto.total);
    const oldInvoice = await this.getInvoiceByIdForUser(
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
    forUpdate: boolean,
    invoiceId: number,
    currentUser: UserEntity,
  ): Promise<InvoiceDto> {
    const params = forUpdate
      ? { id: invoiceId, createdBy: {id: currentUser.id}, displayForUsers: {id: currentUser.id} }
      : { id: invoiceId, displayForUsers: {id: currentUser.id} }
    return await this.getInvoiceByIdForUser(
      params,
      { items: true, createdBy: true, billedTo: true },
    );
  }

  public async getAllInvoicesForUser(
    currentUser: UserEntity, 
    filters: any,
    pageOptionsDto: PageOptionsDto  
  ): Promise<PageDto<InvoiceDto>> {   
    const params = this.getParamsForFilters(filters);
    const listInvoices = await this.invoiceRepository.findAndCount({
      where: {displayForUsers: {id: currentUser.id}, ...params},
      relations: { items: true, createdBy: true, billedTo: true },
      order: {invoiceDate: filters.firstNew? 'DESC' : 'ASC' },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptionsDto, itemCount: listInvoices[1] });
    const pageDto = new PageDto(listInvoices[0], pageMetaDto);
    return pageDto;
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
