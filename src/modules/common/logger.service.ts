import pino from 'pino';
import { Injectable } from '@nestjs/common';

export interface ILoggerService {
  audit(payload);
  info(payload);
  debug(payload);
  warn(payload);
  error(payload);
}

const env = process.env.APP_ENV || 'development';

@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger: pino.Logger;

  constructor(logLevel = 'info') {
    this.logger = pino({
      ...(env !== 'production' ? { prettyPrint: true } : {}),
      level: logLevel,
      customLevels: {
        audit: 35,
      },
    });
  }

  audit(payload) {
    this.logger.audit(payload);
  }

  info(payload) {
    this.logger.audit(payload);
  }

  debug(payload) {
    this.logger.debug(payload);
  }

  warn(payload) {
    this.logger.warn(payload);
  }

  error(payload) {
    this.logger.error(payload);
  }
}
