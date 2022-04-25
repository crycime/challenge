import { Dependencies, Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response } from 'express';
import { get } from 'lodash';
import { LoggerService } from '../modules/common/logger.service';

@Injectable()
@Dependencies(LoggerService)
export class APICallLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}
  use(req: Request, _: Response, next): void {
    this.loggerService.info({
      type: 'API Call Logger',
      path: get(req, 'params.0'),
      method: get(req, 'method'),
      query: get(req, 'query'),
      body: get(req, 'body'),
    });
    next();
  }
}
