import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from '../common/providers/utils/utils.service';
import { EmailService } from 'src/email/email.service';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, VerifyValidationCodeDto } from './DTO/auth.dto';
import { Users } from 'src/users/users.entity';
import {
  AccessTokenDto,
  TokenClaim,
  VerifyValidationCodeResponse,
} from './auth.interface';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { REDIS_CLIENT, RedisClient } from 'src/common/redis/redis.types';
import { GetUser } from 'src/helper/get-user.decorator';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private readonly redisAuthExpire: number;
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    @Inject(REQUEST)
    private readonly request: Request,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {
    this.redisAuthExpire = this.configService.get<number>(
      'REDIS_EXPIRE_TIME',
    );
  }

  async login(loginDto: LoginDto): Promise<AccessTokenDto> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    console.log(user)
    const isCorrect = await UtilsService.comparePass(
      loginDto.password,
      user.password,
    );
    if (!isCorrect) {
      throw new BadRequestException('email/mobile or password is incorrect');
    }
    const { token } = await this.generateTokens(user);
    return {
      token,
    };
  }

  private async generateTokens(userData: Users): Promise<AccessTokenDto> {
    const tokenClaim = this.toClaim(userData);
    const token = await this.generateToken(tokenClaim);
    return {
      token,
    };
  }

  private generateToken(tokenClaim: TokenClaim): string {
    // const token = await this.jwtService.signAsync(tokenClaim, {
    //   secret: this.configService.get<string>('JWT_SECRET'),
    //   expiresIn: this.configService.get<string>('JWT_EXPIRE_TIME'),
    // });

    const token = this.jwtService.sign(tokenClaim);

    return token;
  }

  private toClaim(userData: Users): TokenClaim {
    return {
      id: userData.id,
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      emailVerified: userData.emailVerified
    };
  }

  async sendOtpEmail(email: string): Promise<void> {
    // Generate a new OTP token
    const otpToken = this.generateOtpToken();

    await this.redisClient.set(
      email,
      JSON.stringify({
        code: otpToken,
        isValid: false,
      }),
      'EX',
      this.redisAuthExpire,
    );

    // Send the email to the user with the OTP token
    await this.emailService.sendMail(
      email,
      otpToken,
    );
  }

  private generateOtpToken(): string {
    return Math.floor(100000 + Math.random() * 999999).toString();
  }

  async validateEmail(
    verifyValidationCodeRequest: VerifyValidationCodeDto,
    @GetUser() user: Users,
  ): Promise<VerifyValidationCodeResponse> {
    // Get the OTP token from Redis
    const { code } = verifyValidationCodeRequest;
    const email: string = user.email;

    const storedOtpToken = await this.redisClient.get(email);

    // Compare the OTP tokens
    if (storedOtpToken != null && JSON.parse(storedOtpToken).code === code) {
      // Update the emailVerified field in the database to true
      await this.userService.updateVerifiedEmail(email);

      // Delete the OTP token from Redis
      await this.redisClient.del(email);

      // Return true to indicate success
      return {
        message: 'email is validated',
      };
    } else {
      // Return false to indicate failure
      return {
        message: 'code is not correct',
      };
    }
  }
}
