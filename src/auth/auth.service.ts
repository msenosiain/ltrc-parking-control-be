import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateGoogleUser(profile: any): Promise<User> {
    const { id, name, emails } = profile;
    let user = await this.usersService.findOneByEmail(emails[0].value);

    if (!user) {
      user = await this.usersService.create({
        email: emails[0].value,
        googleId: id,
        name: name.givenName,
        lastName: name.familyName,
      });
    }
    return user;
  }

  async generateJwt(user: User) {
    const payload = {
      sub: user.googleId,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
