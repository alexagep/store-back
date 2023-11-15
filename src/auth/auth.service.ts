import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from '../common/providers/utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './DTO/auth.dto';
import { Users } from 'src/users/users.entity';
import { AccessTokenDto, TokenClaim } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<AccessTokenDto> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    const isCorrect = await UtilsService.comparePass(
      loginDto.password,
      user.password,
    );
    if (!isCorrect) {
      throw new RpcException({
        code: 3,
        message: 'email/mobile or password is incorrect',
      });
    }
    const { token } = await this.generateTokens(user);
    return {
      token,
    };
  }

  private async generateToken(tokenClaim: TokenClaim): Promise<string> {
    const token = await this.jwtService.signAsync(tokenClaim, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRE_TIME'),
    });
    // await this.storeToken(tokenClaim.id, 'token', token);
    return token;
  }

  private async generateTokens(userData: Users): Promise<AccessTokenDto> {
    const tokenClaim = this.toClaim(userData);
    const token = await this.generateToken(tokenClaim);
    return {
      token,
    };
  }

  private toClaim(userData: Users): TokenClaim {
    return {
      id: userData.id,
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
    };
  }

  async verifyTokenAsync(token: string, secret: string): Promise<TokenClaim> {
    const decoded = await this.jwtService.verifyAsync(token, { secret });
    const isTokenFound = await this.readToken(decoded.id);
    if (!isTokenFound) {
      throw new RpcException({
        code: 3,
        message: RPC_BAD_REQUEST,
        data: 'token is invalid',
      });
    }
    return this.toClaim(decoded);
  }

  async verifyToken(token: string): Promise<Observable<TokenClaim>> {
    try {
      const decoded = await this.verifyTokenAsync(
        token,
        this.configService.get<string>('JWT_SECRET'),
      );
      return decoded;
    } catch (e) {
      throw new RpcException({
        code: 3,
        message: RPC_BAD_REQUEST,
        data: e,
      });
    }
  }

  async readToken(userId: string): Promise<string> {
    return this.redisClient.get(`${userId}`);
  }
}
