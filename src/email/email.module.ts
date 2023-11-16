import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_SERVER_HOST'),
          port: config.get('MAIL_SERVER_PORT'),
          secure: config.get('EMAIL_SECURE'),
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `"Nice App" <${config.get('EMAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, 'template'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
