import { Injectable } from '@nestjs/common';
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
        private userRepository: Repository<UserEntity>
    ){}

    public async createInvoice(invoicesDto: InvoicesDto): Promise<InvoicesEntity> {
        const createdBy = await this.userRepository.findOneOrFail({where: {id: invoicesDto.createdBy.id}});
        const billedTo = await this.userRepository.findOneOrFail({where: {id: invoicesDto.billedTo.id}});
        const newInvoice = await this.invoiceRepository.save({
            createdBy: createdBy,
            billedTo: billedTo,
            dueDate: invoicesDto.dueDate,
            invoiceDetail: invoicesDto.invoiceDetail
        });
        let items = await invoicesDto.items.map((item) => this.itemRepository.save({
            name: item.name,
            amount: item.amount,
            price: item.price,
            invoice: newInvoice
        }));
        return newInvoice;
    }

    public async getAllInvoices(): Promise<InvoicesDto[]> {
        return await this.invoiceRepository.find({relations: {items: true, createdBy:true, billedTo: true}});
    }

    public async getOneById(id: number): Promise<InvoicesDto> {
        return await this.invoiceRepository.findOne({where: {id: id}, relations: {items: true, createdBy:true, billedTo: true}});
    }

    public async getAllCreated(id: number): Promise<InvoicesDto[]> {
        return await this.invoiceRepository.find({where: {createdBy: {id: id}}, relations: {items: true, createdBy:true, billedTo: true}});
    }

    public async getAllCreatedForUser(id: number): Promise<InvoicesDto[]> {
        return await this.invoiceRepository.find({where: {billedTo: {id: id}}, relations: {items: true, createdBy:true, billedTo: true}});
    }
}