import { Tokens } from './types/tokens.type';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { threadId } from 'worker_threads';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { isPositive } from 'class-validator';
import { GoogleOauthGuard } from './guards/googleToken.guard';
import { OAuth2Client } from 'google-auth-library';

@Controller('auth')
export class AuthController {
  [x: string]: any;
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    console.log('Done');
  }

  @Redirect(process.env.FRONTEND_URL)
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return;
  }

  @Post('google/test')
  async googleTest(
    @Body('token') token: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.authGoogle(token, req, res);
  }

  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @ApiOperation({ summary: 'Create new User' })
  @ApiResponse({ status: 201, type: UserEntity })
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Get(':link')
  @Redirect(process.env.FRONTEND_URL)
  async activatedLink(@Param('link') link: string) {
    return this.authService.activate(link);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user['id'];
    return this.authService.logout(user, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(200)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokenRefresh } = req.cookies;
    const user = req.user['id'];

    return this.authService.refreshToken(user, tokenRefresh, res);
  }
}
