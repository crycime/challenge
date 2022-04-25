import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [
    {
      provide: LoggerService,
      useValue: new LoggerService(),
    },
  ],
  exports: [LoggerService],
})
export class CommonModule {}
