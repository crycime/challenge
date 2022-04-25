import { Module } from '@nestjs/common';
import { PairHandlerService } from './services/pair.handler.service';
import { PairController } from './controllers/pair.controller';
import { PairRepository } from './repository/pair.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PairSchema } from './schema/pair.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { NomicsModule } from '../serviceClient/nomics/nomics.module';
import { PairTasks } from './task/pair.tasks';
import { BullModule } from '@nestjs/bull';
import { PAIR_QUEUE_NAME } from './queue/constants';
import { PairQueue } from './queue/pair.queue';
import { PairProcessor } from './queue/pair.processor';
import { RedisClientModule } from '../redis/redisClient.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: 'pair', schema: PairSchema }]),
    BullModule.registerQueue({
      name: PAIR_QUEUE_NAME,
    }),
    NomicsModule,
    RedisClientModule,
  ],
  controllers: [PairController],
  providers: [
    PairHandlerService,
    PairRepository,
    PairTasks,
    PairQueue,
    PairProcessor,
  ],
})
export class PairModule {}
