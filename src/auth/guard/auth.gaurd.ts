import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToRpc().getContext();
    const { authorization } = ctx?.getMap();
    if (!authorization) {
      return false;
    }
    try {
      const decoded = await this.jwtService.verifyAsync(authorization, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      ctx.set('user', decoded);
    } catch (e) {
      return false;
    }
    return true;
  }
}
