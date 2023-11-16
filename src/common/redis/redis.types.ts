import redis from 'ioredis';

export type RedisClient = ReturnType<typeof redis.createClient>;
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
