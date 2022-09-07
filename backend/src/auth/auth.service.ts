import { OAuth2Client } from 'google-auth-library';
import { AuthDto } from './dto/auth.dto';
import {
  BadRequestException,
  ForbiddenException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { isHalfWidth } from 'class-validator';
// import { Auth, google } from 'googleapis';
import { v4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { Request, Response } from 'express';
import { UserGoogle, Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  //
  //
  //

  async authGoogle(token: string, req: Request, res: Response) {
    const verifyUser = await this.verifyGoogleUser(token);

    if (!verifyUser) {
      throw new BadRequestException('No user from google');
    }

    console.log('start');

    const userData = await this.userRepository.findOneBy({
      email: verifyUser['email'],
    });

    if (userData) {
      const tokens = await this.getTokens(userData.id, userData.email);
      this.updateRt(userData.id, tokens.refresh_token);

      res.cookie('tokenRefresh', tokens.refresh_token, {
        maxAge: Number(process.env.MAX_AGE_COOKIE_TOKEN),
        httpOnly: true,
      });

      return {
        user: userData,
        tokens: tokens,
      };
    }
    if (!userData) {
      const newUser = await this.userRepository.create({
        email: verifyUser.email,
        firstName: verifyUser.firstName,
        lastName: verifyUser.lastName,
        avatarPath: verifyUser.avatarPath,
        refreshTokenHash: '',
        isVerified: true,
      });

      const tokens = await this.getTokens(newUser['id'], newUser['email']);

      this.updateRt(newUser.id, tokens.refresh_token);

      res.cookie('tokenRefresh', tokens.refresh_token, {
        maxAge: Number(process.env.MAX_AGE_COOKIE_TOKEN),
        httpOnly: true,
      });
      const userCreate = await this.userRepository.save(newUser);

      return {
        userCreate,
        tokens,
      };
    }
  }

  async verifyGoogleUser(token: string) {
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, given_name, family_name } =
      ticket.getPayload();

    const user = {
      email: email,
      firstName: given_name,
      lastName: family_name,
      avatarPath: picture,
    };
    return user;
  }

  //
  //
  //
  async login(dto: AuthDto, res: Response) {
    const user = await this.validateUser(dto);
    const tokens = await this.getTokens(user.id, user.email);
    this.updateRt(user.id, tokens.refresh_token);
    res.cookie('tokenRefresh', tokens.refresh_token, {
      maxAge: Number(process.env.MAX_AGE_COOKIE_TOKEN),
      httpOnly: true,
    });

    return {
      user: this.returnUser(user),
      tokens: tokens,
    };
  }
  //
  //
  //
  async register(dto: AuthDto) {
    const oldUser = await this.userRepository.findOneBy({ email: dto.email });

    if (oldUser) {
      throw new BadRequestException('Email already exists');
    }
    const activationLink = v4();
    const salt = await genSalt(3);
    const newUser = await this.userRepository.create({
      email: dto.email,
      password: await hash(dto.password, salt),
      activationLink: activationLink,
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.mailerService
      .sendMail({
        to: dto.email,
        subject: 'Register',
        text: '=)',
        html: `
          <div>
          <h1>Hello World =) </h1>
          <a href='http://localhost:3001/api/auth/${activationLink}'>Click Me</a>

          </div>
        `,
      })
      .catch((e) => {
        throw new HttpException(
          `Error: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });

    this.updateRt(newUser.id, tokens.refresh_token);
    const user = await this.userRepository.save(newUser);

    return {
      user,
      tokens,
    };
  }
  //
  //
  //
  async logout(userId: number, res: Response) {
    const user = await this.userRepository.findOneBy({ id: userId });
    user.refreshTokenHash = '';
    try {
      await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
      return new NotFoundException('Error with logout');
    }
    res.clearCookie('tokenRefresh');
    return HttpCode(200);
  }
  //
  //
  //
  async refreshToken(userId: number, rt: string, res: Response) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return new ForbiddenException('Acces Denied');
    }

    const rtMatches = await compare(rt, user.refreshTokenHash);
    if (!rtMatches) {
      return new ForbiddenException('Acces Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    this.updateRt(user.id, tokens.refresh_token);
    res.cookie('tokenRefresh', tokens.refresh_token, {
      httpOnly: true,
      maxAge: Number(process.env.MAX_AGE_COOKIE_TOKEN),
    });

    return {
      user: user,
      tokens: tokens,
    };
  }

  //
  //
  //
  async validateUser(dto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
      select: ['id', 'email', 'password'],
    });
    if (!user) throw new NotFoundException('User not found');

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Your password or email is wrong, try again please',
      );
    }

    return user;
  }
  //
  //
  //
  async getTokens(userId: number, email: string) {
    const data = {
      id: userId,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(data, {
        expiresIn: process.env.MAX_AGE_ACCESS_TOKEN,
        secret: process.env.JWT_SECRET,
      }),

      this.jwtService.signAsync(data, {
        expiresIn: process.env.MAX_AGE_COOKIE_REFRESH_TOKEN,
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  //
  //
  //
  async updateRt(userId: number, rt: string) {
    const salt = await genSalt(3);
    const rtHash = await hash(rt, salt);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.refreshTokenHash = rtHash;
    await this.userRepository.save(user);

    return user.refreshTokenHash;
  }

  //
  //
  //

  async activate(activationLink: string) {
    const user = await this.userRepository.findOneBy({ activationLink });

    if (!user) {
      throw new Error('Link not found');
    }

    user.isVerified = true;

    await this.userRepository.save(user);

    return HttpCode(200);
  }

  returnUser(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
