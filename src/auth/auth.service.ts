import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from '../common/providers/utils/utils.service';
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

@Injectable()
export class AuthService {
  private readonly redisAuthExpire: number;
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REQUEST)
    private readonly request: Request,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {
    this.redisAuthExpire = this.configService.get<number>(
      'REDIS_JWT_EXPIRE_TIME',
    );
  }

  async login(loginDto: LoginDto): Promise<AccessTokenDto> {
    const user = await this.userService.findUserByEmail(loginDto.email);

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

  private async generateToken(tokenClaim: TokenClaim): Promise<string> {
    const token = await this.jwtService.signAsync(tokenClaim, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRE_TIME'),
    });

    return token;
  }

  private toClaim(userData: Users): TokenClaim {
    return {
      id: userData.id,
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
    };
  }

  async sendOtpEmail(email: string): Promise<void> {
    // Generate a new OTP token
    const otpToken = this.generateOtpToken();

    // Save the OTP token in Redis with a 5-minute expiration time
    // const redisClient = await this.redisService.getClient();
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
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email verification',
      text: `Your OTP token is ${otpToken}. It will expire in 5 minutes.`,
    });
  }

  private generateOtpToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async validateEmail(
    verifyValidationCodeRequest: VerifyValidationCodeDto,
  ): Promise<VerifyValidationCodeResponse> {
    // Get the OTP token from Redis
    const { code } = verifyValidationCodeRequest;
    const email: string = this.request.user.email;

    const redisClient = await this.redisService.getClient();
    const storedOtpToken = await redisClient.get(email);

    // Compare the OTP tokens
    if (storedOtpToken === code) {
      // Update the emailVerified field in the database to true
      await this.userRepository.update({ email }, { emailVerified: true });

      // Delete the OTP token from Redis
      await redisClient.del(email);

      // Return true to indicate success
      return {
        message: 'email is validated',
      };
    } else {
      // Return false to indicate failure
      return {
        message: 'error in validating email',
      };
    }
  }
}
