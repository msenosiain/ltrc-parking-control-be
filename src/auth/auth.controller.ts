import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const token = await this.authService.generateJwt(req.user);
    const callbackUrl = this.configService.get<string>(
      'GOOGLE_AUTH_CALLBACK_URL',
      'http://localhost:4200/auth/callback',
    );

    // Redirect back to Angular app with token in URL
    res.redirect(`${callbackUrl}?token=${token.access_token}`);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  getProfile(@Req() req) {
    return req.user;
  }
}
