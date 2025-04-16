import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const token = await this.authService.generateJwt(req.user);
    const callbackUrl = this.configService.get<string>(
      'GOOGLE_AUTH_CALLBACK_URL',
      'http://localhost:4200/auth/callback',
    );
    res.redirect(
      `${callbackUrl}?access_token=${token.access_token}&refresh_token=${token.refresh_token}`,
    );
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refreshTokens(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
}
