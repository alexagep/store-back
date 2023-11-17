import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTO/user.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { REDIS_CLIENT, RedisClient } from 'src/common/redis/redis.types';

@Injectable()
export class UsersService {
  private readonly redisAuthExpire: number;

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,

    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {
    this.redisAuthExpire = this.configService.get<number>(
      'REDIS_EXPIRE_TIME',
    );
  }

  async create(userInfo: CreateUserDto): Promise<Users> {
    const createdUser = await this.userRepository.create(userInfo);

    await this.userRepository.save(createdUser);

    // await this.sendOtpEmail(userInfo.email)

    return createdUser;
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    // use the repository method to find a user by email and hashed password
    const user = await this.userRepository.findOne({
      where: { email },
    });
    // return the user or null if not found
    return user || null;
  }

  async updateVerifiedEmail(email: string): Promise<void> {
    await this.userRepository.update({ email }, { emailVerified: true });
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
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
