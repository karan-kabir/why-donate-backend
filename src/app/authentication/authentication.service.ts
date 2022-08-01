import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TokenPayload } from './interface/token-payload.interface';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  time_http_only = moment().add(1, 'h').unix();

  public async getSearch(title: string) {
    try {
      return this.usersService.search(title);
    } catch (e) {
      throw new Error("User doesn't exist");
    }
  }

  public async getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRES_IN')}h`,
    });
    let cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.time_http_only}`;
    return { token: `Authentication=${token};`, cookie: cookie };
  }

  public getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const _password = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, _password);
      return await this.usersService.getByBasicData(email);
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'invalid Password!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return isPasswordMatching;
  }
}
