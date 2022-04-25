import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { ValidationPipe } from '../../src/middlewares/validation.pipe';
import { CommonModule } from '../../src/modules/common/common.module';
import { AllExceptionFilter } from '../../src/middlewares/exception.filter';
import { APICallLoggerMiddleware } from '../../src/middlewares/apiCallLogger.middleware';

@Module({})
export class GenericE2ETestModule implements NestModule {
  static register({
    imports = [],
    controllers = [],
    providers = [],
  }): DynamicModule {
    return {
      module: GenericE2ETestModule,
      imports: [...imports, CommonModule],
      controllers: [...controllers],
      providers: [
        ...providers,
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe(),
        },
        { provide: APP_FILTER, useClass: AllExceptionFilter },
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(APICallLoggerMiddleware).forRoutes('*');
  }
}
