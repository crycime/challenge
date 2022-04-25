import { Process, Processor, OnQueueActive, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { PAIR_QUEUE_NAME, PAIR_STATISTICS_JOB_NAME } from './constants';
import { LoggerService } from '../../common/logger.service';
import { pairListRedisKey } from '../../../utils/redis.util';
import * as _ from 'lodash';
import { ComicsService } from '../../serviceClient/nomics/services/nomics.service';
import { PairRepository } from '../repository/pair.repository';
import { RedisClientService } from '../../redis/redisClient.service';

@Processor(PAIR_QUEUE_NAME)
export class PairProcessor {
  constructor(
    private readonly logger: LoggerService,
    private readonly comicsService: ComicsService,
    private readonly pairRepository: PairRepository,
    private readonly redisClientService: RedisClientService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.debug(
      `job ${job.id} of type ${job.name} with data ${job.data} failed.`,
    );
    this.logger.error(err.stack);
  }

  @Process(PAIR_STATISTICS_JOB_NAME)
  async handlePairStatistics(job: Job) {
    this.logger.debug('Start job...');
    this.logger.debug(job.data);
    await this.redisClientService.del(pairListRedisKey());
    const pairList = await this.comicsService.currenciesTicker({
      ids: 'BTC,ETH,LTC,XMR,XRP,DOGE,DASH,MAID,LSK,SJCX',
      convert: 'USD',
    });
    const upsertDoc = _.map(pairList, (pair) => ({
      updateOne: {
        filter: {
          name: pair?.name,
        },
        update: {
          name: pair?.name,
          currency: pair?.currency,
          convert: 'USD',
          price: pair?.price,
          volume: pair?.['1h']?.volume ?? 0,
          price_change: pair?.['1h']?.price_change ?? 0,
        },
        upsert: true,
      },
    }));
    await this.pairRepository.bulkWrite(upsertDoc);
    await this.redisClientService.del(pairListRedisKey());
  }
}
