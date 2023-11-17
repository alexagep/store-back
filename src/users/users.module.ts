import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { Users } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisClientFactory } from 'src/common/redis/redis.factory';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), EmailModule],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, redisClientFactory],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
