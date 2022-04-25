import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionFilter } from './middlewares/exception.filter';
import { ValidationPipe } from './middlewares/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './modules/common/logger.service';
import { parseDescription } from './utils/swagger.util';

const env = process.env.APP_ENV || 'development';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const loggerService = app.get(LoggerService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter(loggerService));
  if (env === 'development') {
    app.enableCors();
  }
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'public'));
  app.setViewEngine('html');
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // swagger
  const config = new DocumentBuilder()
    .setTitle('igo backend')
    .setDescription('igo backend API')
    .setDescription(
      parseDescription({
        keyPts: ['404：资源不存在', '405：请求数据错误', '500：服务器内部错误'],
      }),
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(port, () =>
    console.log(`application running on port ${port}`),
  );
}
bootstrap();
