import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // this is set by the jwtAuthGuard
    // console.log(user)
    if (!user.emailVerified) {
      return false;
    }
    return true;
  }
}
