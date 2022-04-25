import { Injectable } from '@nestjs/common';
import { PairRepository } from '../repository/pair.repository';
import { PairDto } from '../schema/pair.schema';
import { RedisClientService } from '../../redis/redisClient.service';
import { pairListRedisKey } from '../../../utils/redis.util';
import * as _ from 'lodash';

@Injectable()
export class PairHandlerService {
  constructor(
    private readonly pairRepository: PairRepository,
    private readonly redisClientService: RedisClientService,
  ) {}

  async getPairList(): Promise<PairDto[]> {
    const res = await this.redisClientService.get(pairListRedisKey());
    if (!_.isEmpty(res)) return res;
    const data = await this.pairRepository.find({ filter: {} });
    await this.redisClientService.set({
      key: pairListRedisKey(),
      value: JSON.stringify(data),
    });
    return data;
  }
}
