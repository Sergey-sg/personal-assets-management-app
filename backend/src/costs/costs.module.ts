import { Module } from '@nestjs/common';
import { CostsService } from './costs.service';
import { CostsController } from './costs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostEntity } from './entities/cost.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CostEntity, WalletEntity, UserEntity])],
  controllers: [CostsController],
  providers: [CostsService],
})
export class CostsModule {}
