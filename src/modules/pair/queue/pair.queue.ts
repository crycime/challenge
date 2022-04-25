import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { PAIR_QUEUE_NAME, PAIR_STATISTICS_JOB_NAME } from './constants';

@Injectable()
export class PairQueue {
  constructor(
    @InjectQueue(PAIR_QUEUE_NAME) private readonly couponQueue: Queue,
  ) {}

  async pairStatistics() {
    await this.couponQueue.add(
      PAIR_STATISTICS_JOB_NAME,
      {},
      {
        attempts: 3, // The total number of attempts to try the job until it completes.
        removeOnComplete: true, // If true, removes the job when it successfully completes.
        backoff: {
          type: 'fixed', // Backoff type, which can be either `fixed` or `exponential`.
          delay: 3000, // Backoff delay, in milliseconds.
        },
        removeOnFail: 10,
      },
    );
  }
}
