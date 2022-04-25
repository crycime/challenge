import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { LoggerService } from '../../common/logger.service';
import { PairQueue } from '../queue/pair.queue';

@Injectable()
export class PairTasks {
  constructor(
    private readonly logger: LoggerService,
    private readonly pairQueue: PairQueue,
  ) {}

  @Timeout(1000)
  async statistics() {
    await this.pairQueue.pairStatistics();
  }

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'statisticsByHour',
    timeZone: 'Asia/Shanghai',
  })
  async statisticsByHour() {
    await this.pairQueue.pairStatistics();
  }
}
