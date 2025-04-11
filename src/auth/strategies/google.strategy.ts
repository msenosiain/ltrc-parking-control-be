import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private allowedDomain = this.configService.get<string>(
    'GOOGLE_AUTH_ALLOWED_DOMAIN',
    '',
  );

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get<string>(
        'GOOGLE_AUTH_REDIRECT_URL',
        'http://localhost:3000/api/v1/auth/google/redirect',
      ),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const email = profile.emails[0].value;
    const domain = email.split('@')[1];

    // Restrict to your Google Workspace domain
    if (domain !== this.allowedDomain) {
      return done(new Error('Unauthorized domain'), false);
    }

    return this.authService.validateGoogleUser(profile);
  }
}
