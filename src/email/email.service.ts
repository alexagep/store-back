import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { renderFile } from 'ejs';
import { join } from 'path';
import { writeFileSync } from 'fs';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email: string, otpToken: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Sending OTP token to user's Email",
      template: './welcome2',
      text: `Your OTP token: ${otpToken}. تا ۵ دقیقه دیگر منقضی خواهد شد.`,
      context: {
        otpToken: otpToken,
        email: process.env.EMAIL_USER,
        name: name,
      },
    });
  }

  async saveMockFile(email: string, otpToken: string) {
    const templatePath = join(__dirname, 'template', 'welcome2.ejs');
    const outputPath = join(__dirname, 'mock.txt');
    renderFile(templatePath, { email, otpToken }, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        writeFileSync(outputPath, result, 'utf8');
      }
    });
  }
}
