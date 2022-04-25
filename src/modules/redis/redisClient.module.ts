import { Module } from '@nestjs/common';
import { RedisClientService } from './redisClient.service';
import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        {
          ...configService.get<RedisOptions>('REDIS'),
          retryStrategy: (times: number) => {
            if (times > configService.get('connectionMaxRetry')) {
              console.error({
                location: 'Redis retryStrategy',
                type: 'Redis connection error',
                err: 'Redis connection retry has reach the limit',
              });
              return;
            }
            return Math.min(times * 2000, 3000);
          },
        },
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
