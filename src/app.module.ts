import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { APICallLoggerMiddleware } from './middlewares/apiCallLogger.middleware';
import { PairModule } from './modules/pair/pair.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    PairModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(APICallLoggerMiddleware).forRoutes('*');
  }
}
