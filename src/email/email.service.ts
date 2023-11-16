import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(email: string, otpToken: string) {
    //TODO: check when get email from part best engineers
    await this.mailerService.sendMail({
      to: email,
      subject: 'Greeting from NestJS NodeMailer',
      template: './welcome',
      text: `Your OTP token is ${otpToken}. It will expire in 5 minutes.`,
    });
  }
}
