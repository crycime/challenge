import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ComicsService } from './services/nomics.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        baseURL: config.get('SERVICES.nomics.url'),
        timeout: config.get('SERVICES.defaultTimeOut'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ComicsService],
  exports: [ComicsService],
})
export class NomicsModule {}
