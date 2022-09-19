import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { InvoicesEntity } from './entities/invoices.entity';
import { ItemEntity } from './entities/item.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [TypeOrmModule.forFeature([InvoicesEntity, ItemEntity, UserEntity])],
  controllers: [InvoicesController],
  providers: [InvoicesService]
})
export class InvoicesModule {}
