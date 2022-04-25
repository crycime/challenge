import { Injectable } from '@nestjs/common';

import { Pipeline } from 'ioredis';
import * as Redis from 'ioredis';
import * as _ from 'lodash';
import { RedisService } from 'nestjs-redis';
import { CatchError } from '../../decorators/catchError.decorator';
import { RedisResponseErrorException } from '../../exceptions/redisResponseError.exception';
import { BooleanResponse } from 'ioredis';

@CatchError(RedisResponseErrorException)
@Injectable()
export class RedisClientService {
  private redisClient: Redis.Redis;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient('cache');
  }

  async set({ key, value }: { key: string; value: any }): Promise<any> {
    if (_.isPlainObject(value)) {
      value = JSON.stringify(value);
    }
    return this.redisClient.set(key, value);
  }

  async get(key: string): Promise<any> {
    const value = await this.redisClient.get(key);
    try {
      return JSON.parse(value);
    } catch (_) {
      return value;
    }
  }

  async setnx(key: string): Promise<number> {
    return await this.redisClient.setnx(key, 1);
  }

  async hmset(key: string, data: any): Promise<any> {
    return this.redisClient.hmset(key, data);
  }

  async hgetall(key: string): Promise<any> {
    return this.redisClient.hgetall(key);
  }

  async hget(key: string, field: string): Promise<any> {
    const value = await this.redisClient.hget(key, field);
    try {
      return JSON.parse(value);
    } catch (_) {
      return value;
    }
  }

  async hdel(key: string, field: string): Promise<any> {
    return this.redisClient.hdel(key, field);
  }

  async lpush(key: string, values: string[] | string): Promise<any> {
    if (_.isArray(values)) {
      return this.redisClient.lpush(key, ...values);
    }
    return this.redisClient.lpush(key, values);
  }

  async lpop(key: string): Promise<any> {
    return this.redisClient.lpop(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<any> {
    return this.redisClient.lrange(key, start, stop);
  }

  async sadd(key: string, values: string[] | string): Promise<any> {
    if (_.isArray(values)) {
      return this.redisClient.sadd(key, ...values);
    }
    return this.redisClient.sadd(key, values);
  }

  async spop(key: string): Promise<string | null> {
    return this.redisClient.spop(key);
  }

  async sismember(key: string, member: string): Promise<BooleanResponse> {
    return this.redisClient.sismember(key, member);
  }

  async smembers(key: string): Promise<string[]> {
    return this.redisClient.smembers(key);
  }

  async srandmember(key: string, count: number): Promise<any[]> {
    return this.redisClient.srandmember(key, count);
  }

  async srem(key: string, arg1: any): Promise<any> {
    return this.redisClient.srem(key, arg1);
  }

  async scard(key: string): Promise<number> {
    return this.redisClient.scard(key);
  }

  async zrank(key: string, member: string): Promise<number | null> {
    return this.redisClient.zrank(key, member);
  }

  async zadd(key: string, score: number, member: string): Promise<any> {
    return this.redisClient.zadd(key, score, member);
  }

  async zaddAndRemByscore(
    key: string,
    score: number,
    member: string,
  ): Promise<any> {
    await this.zremrangebyscore(key, score, score);
    return await this.redisClient.zadd(key, score, member);
  }

  async zrem(key: string, member: string): Promise<any> {
    return this.redisClient.zrem(key, member);
  }

  async zremrangebyscore(
    key: string,
    min: number,
    max: number,
  ): Promise<number> {
    return this.redisClient.zremrangebyscore(key, min, max);
  }

  async zcard(key: string): Promise<number> {
    return this.redisClient.zcard(key);
  }

  async zrangebyscore(
    key: string,
    min: number,
    max: number,
    withScores?: boolean,
  ): Promise<any[]> {
    const data = await this.redisClient.zrangebyscore(
      key,
      min,
      max,
      ...((withScores ? ['WITHSCORES'] : []) as any),
    );
    return _.map(data, (res: string) => {
      try {
        return JSON.parse(res);
      } catch (_) {
        return res;
      }
    });
  }

  // 递增排列
  async zrange(
    key: string,
    start: number,
    stop: number,
    withScores?: boolean,
  ): Promise<string[]> {
    return this.redisClient.zrange(
      key,
      start,
      stop,
      ...((withScores ? ['WITHSCORES'] : []) as any),
    );
  }

  // 递减排列
  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.zrevrange(key, start, stop);
  }

  async keys(key: string): Promise<string[]> {
    return this.redisClient.keys(key);
  }

  async exists(key: string): Promise<number> {
    return this.redisClient.exists(key);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async expire(key: string, seconds: number): Promise<BooleanResponse> {
    return this.redisClient.expire(key, seconds);
  }

  async execMulti(fun: (multi: Pipeline) => void): Promise<any[]> {
    const multi = this.redisClient.multi();
    fun(multi);
    const result = await multi.exec();
    return _.map(result, ([err, data]) => {
      if (err) throw err;
      return data;
    });
  }
}
