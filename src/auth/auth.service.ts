import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwt(user: any) {
    const payload = {
      sub: user.googleId,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
