// Import the required modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'; // Assuming you have a User entity with email and emailVerified fields
import { MailerService } from '@nestjs-modules/mailer'; // Assuming you have installed and configured @nestjs-modules/mailer
import { RedisService } from 'nestjs-redis'; // Assuming you have installed and configured nestjs-redis

@Injectable()
export class UserService {
  // Inject the repository, mailer, and redis services
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
    private redisService: RedisService,
  ) {}

  // Generate a random OTP token of 6 digits
  private generateOtpToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send an email to the user with the OTP token
  async sendOtpEmail(email: string): Promise<void> {
    // Generate a new OTP token
    const otpToken = this.generateOtpToken();

    // Save the OTP token in Redis with a 5-minute expiration time
    const redisClient = await this.redisService.getClient();
    await redisClient.set(email, otpToken, 'EX', 300);

    // Send the email to the user with the OTP token
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email verification',
      text: `Your OTP token is ${otpToken}. It will expire in 5 minutes.`,
    });
  }

  // Validate the user's email with the OTP token
  async validateEmail(email: string, otpToken: string): Promise<boolean> {
    // Get the OTP token from Redis
    const redisClient = await this.redisService.getClient();
    const storedOtpToken = await redisClient.get(email);

    // Compare the OTP tokens
    if (storedOtpToken === otpToken) {
      // Update the emailVerified field in the database to true
      await this.userRepository.update({ email }, { emailVerified: true });

      // Delete the OTP token from Redis
      await redisClient.del(email);

      // Return true to indicate success
      return true;
    } else {
      // Return false to indicate failure
      return false;
    }
  }
}
