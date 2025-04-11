import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'GOOGLE_AUTH_JWT_SECRET',
        'super-secret-key',
      ),
    });
  }

  async validate(payload: any) {
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      lastName: payload.lastName,
      roles: payload.roles,
    };
  }
}
