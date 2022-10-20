import { UserEntity } from 'src/user/entities/user.entity';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAtStrategy } from './strategies/jwtAt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtRtStrategy } from './strategies/jwtRt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAtStrategy, JwtRtStrategy],
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [AuthService],
})
export class AuthModule {}
