import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTO/user.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { REDIS_CLIENT, RedisClient } from 'src/common/redis/redis.types';
import { VerifyValidationCodeResponse } from 'src/auth/auth.interface';
import { CreateUserResponse } from './users.interface';

@Injectable()
export class UsersService {
  private readonly redisAuthExpire: number;

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,

    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {
    this.redisAuthExpire = this.configService.get<number>('REDIS_EXPIRE_TIME');
  }

  async create(userInfo: CreateUserDto): Promise<CreateUserResponse> {
    const createdUser = await this.userRepository.create(userInfo);

    const user = await this.userRepository.save(createdUser);

    this.sendOtpEmail(user.email, user.name);

    delete user.password;

    return {
      userInfo: user,
      message: 'otpCode is sent to your Email, check it out',
    };
  }

  async resendCode(user: Users): Promise<VerifyValidationCodeResponse> {
    if (user.emailVerified) {
      throw new BadRequestException('you already are verified');
    }

    this.sendOtpEmail(user.email, user.name);

    return {
      message: 'otpCode is sent, check it out',
    };
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user || null;
  }

  async updateVerifiedEmail(email: string): Promise<void> {
    await this.userRepository.update({ email }, { emailVerified: true });
  }

  async sendOtpEmail(email: string, name: string): Promise<void> {
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

    // await this.emailService.saveMockFile(email, otpToken);
    await this.emailService.sendMail(email, otpToken, name);
  }

  private generateOtpToken(): string {
    return Math.floor(1000000 + Math.random() * 9999999).toString();
  }
}
