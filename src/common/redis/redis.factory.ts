import { FactoryProvider } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisClient, REDIS_CLIENT } from './redis.types';

export const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const port = await configService.get<number>('REDIS_PORT');
    const host = await configService.get<string>('REDIS_HOST');
    const options: RedisOptions = {
      family:
        4 || ((await configService.get<number>('REDIS_FAMILY')) as number),
      db: await configService.get<number>('REDIS_DB'),
      password: await configService.get<string>('REDIS_PASSWORD'),
    };
    const client = new Redis(port, host, options);
    return client;
  },
};
