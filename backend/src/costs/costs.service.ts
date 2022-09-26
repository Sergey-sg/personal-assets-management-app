import { CostEntity } from './entities/cost.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { UserEntity } from '../user/entities/user.entity';
import { LimitOffsetQueryDto } from '../dto/limit-offset-query.dto';
import { AllWalletCostsResponseDto } from './dto/all-wallet-costs-response.dto';
import { AllUserCostsResponseType } from './interfaces/all-user-costs-response.type';
import { roundSum } from '../actions/round-sum';

@Injectable()
export class CostsService {
  constructor(
    @InjectRepository(CostEntity)
    private costRepository: Repository<CostEntity>,
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async createCost(
    walletId: number,
    createCostDto: CreateCostDto,
  ): Promise<CostEntity> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      relations: ['owner'],
    });

    if (!wallet) {
      throw new HttpException(
        `Wallet with id: ${walletId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const newCost = this.costRepository.create(createCostDto);
    newCost.cost_sum = roundSum(+newCost.cost_sum);

    if (+wallet.total_balance < +newCost.cost_sum) {
      throw new HttpException(
        `Wallet balance cannot be less than 0`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createCostDto.is_transaction) {
      if (!createCostDto.to_user_id) {
        throw new HttpException(
          `If it's transaction, should specify user`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const toUser = await this.userRepository.findOne({
        where: { id: createCostDto.to_user_id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
      if (!toUser) {
        throw new HttpException(
          `User with id: ${createCostDto.to_user_id} doesn't find`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (toUser.id === wallet.owner.id) {
        throw new HttpException(
          `You can't send a request to yourself`,
          HttpStatus.BAD_REQUEST,
        );
      }
      newCost.to_user = toUser;
    }

    newCost.wallet = wallet;
    wallet.total_balance = +wallet.total_balance - +newCost.cost_sum;

    return await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        await entityManager.withRepository(this.walletRepository).save(wallet);
        return await entityManager
          .withRepository(this.costRepository)
          .save(newCost);
      },
    );
  }

  async getAllWalletCosts(
    walletId: number,
    query: LimitOffsetQueryDto,
  ): Promise<AllWalletCostsResponseDto> {
    const wallet = await this.walletRepository.findOneBy({ id: walletId });

    if (!wallet) {
      throw new HttpException(
        `Wallet with id: ${walletId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    const [costs, costs_count] = await this.costRepository.findAndCount({
      where: { wallet: { id: walletId } },
      order: { createdAt: 'DESC' },
      skip: query.offset,
      take: query.limit,
    });

    return { ...wallet, costs, costs_count };
  }

  async getAllUserCosts(
    userId: number,
    query: LimitOffsetQueryDto,
  ): Promise<AllUserCostsResponseType> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['wallets'],
    });

    if (!user) {
      throw new HttpException(
        `User with id: ${userId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    let costs_count = 0;
    let costs = [];

    if (user.wallets.length <= 0) {
      return { ...user, costs, costs_count };
    }

    const walletsIds = user.wallets.map((wallet) => wallet.id);

    [costs, costs_count] = await this.costRepository.findAndCount({
      where: { wallet: { id: In(walletsIds) } },
      order: { createdAt: 'DESC' },
      skip: query.offset,
      take: query.limit,
    });

    return { ...user, costs, costs_count };
  }

  async updateCost(
    costId: number,
    updateCostDto: UpdateCostDto,
  ): Promise<CostEntity> {
    const cost = await this.costRepository.findOne({
      where: { id: costId },
      relations: ['wallet'],
    });

    if (!cost) {
      throw new HttpException(
        `Cost with id: ${costId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (cost.is_transaction) {
      throw new HttpException(
        `Transactions can't be updated`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCost = this.costRepository.create(updateCostDto);

    if (updateCostDto.cost_sum) {
      const roundNewSum = roundSum(+updateCostDto.cost_sum);
      const wallet = await this.walletRepository.findOneBy({
        id: cost.wallet.id,
      });
      const totalSumAfterUpdate =
        +wallet.total_balance + +cost.cost_sum - +roundNewSum;
      if (totalSumAfterUpdate < 0) {
        throw new HttpException(
          `Wallet balance cannot be less than 0`,
          HttpStatus.BAD_REQUEST,
        );
      }
      wallet.total_balance = totalSumAfterUpdate;
      newCost.cost_sum = roundNewSum;

      return await this.dataSource.transaction(
        async (entityManager: EntityManager) => {
          await entityManager
            .withRepository(this.walletRepository)
            .save(wallet);
          await entityManager
            .withRepository(this.costRepository)
            .update({ id: costId }, newCost);
          return await entityManager
            .withRepository(this.costRepository)
            .findOneBy({ id: costId });
        },
      );
    }

    await this.costRepository.update({ id: costId }, newCost);
    return await this.costRepository.findOneBy({ id: costId });
  }

  async removeCost(costId: number): Promise<void> {
    const cost = await this.costRepository.findOne({
      where: { id: costId },
      relations: ['wallet'],
    });

    if (!cost) {
      throw new HttpException(
        `Cost with id: ${costId} doesn't find`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (cost.is_transaction) {
      throw new HttpException(
        `Transactions can't be deleted`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const wallet = await this.walletRepository.findOneBy({
      id: cost.wallet.id,
    });
    wallet.total_balance = +wallet.total_balance + +cost.cost_sum;

    await this.dataSource.transaction(async (entityManager: EntityManager) => {
      await entityManager.withRepository(this.walletRepository).save(wallet);
      await entityManager
        .withRepository(this.costRepository)
        .delete({ id: costId });
    });
  }
}
