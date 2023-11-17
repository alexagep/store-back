import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import ejs, { renderFile } from 'ejs';
import path, { join } from 'path';
import { writeFileSync } from 'fs';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email: string, otpToken: string) {
    //TODO: check when get email from part best engineers
    await this.mailerService.sendMail({
      to: email,
      subject: 'Sending OTP token to user\'s Email',
      template: './welcome',
      text: `Your OTP token is ${otpToken}. It will expire in 5 minutes.`,
      context: {
        otpToken: otpToken, // pass the otpToken value as a context object
      }, 
    }); 
  }

  async saveMockFile(email: string, otpToken: string) {
    // Define the path to the template file
    const templatePath = join(__dirname, 'template','welcome2.ejs');
    // Define the path to the output file
    const outputPath = join(__dirname, 'mock.txt');
    // Render the template with the data
    renderFile(templatePath, { email, otpToken }, (err, result) => {
      if (err) {
        // Handle the error
        console.error(err);
      } else {
        // Write the result to the output file
        writeFileSync(outputPath, result, 'utf8');
      }
    });
  }

}

