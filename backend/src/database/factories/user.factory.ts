import { Factory, FactorizedAttrs } from '@jorgebodega/typeorm-factory';
import { faker } from '@faker-js/faker';
import { genSalt, hash } from 'bcryptjs';

import { UserEntity } from '../../user/entities/user.entity';
import dataSource from '../dataSource';

export class UserFactory extends Factory<UserEntity> {
  protected entity = UserEntity;
  protected dataSource = dataSource;
  protected attrs(): FactorizedAttrs<UserEntity> {
    return {
      isVerified: true,
      refreshTokenHash: '',
      firstName: faker.name.firstName,
      lastName: faker.name.lastName,
      email: faker.internet.email,
      password: async () => await hash('testdata', await genSalt(3)),
      address: faker.address.streetAddress(true),
      phone: faker.phone.number('+380#########'),
      birthdate: faker.date.birthdate(),
      activationLink: faker.random.alphaNumeric(64),
      avatarPath: faker.image.avatar(),

      wallets: [],
      income_transactions: [],
      costs_transactions: [],
    };
  }
}
