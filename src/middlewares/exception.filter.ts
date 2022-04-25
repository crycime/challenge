import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../modules/common/logger.service';

type ExceptionResponse = {
  statusCode: HttpStatus;
  message: string;
  code: string;
  timestamp: string;
  path: string;
  type: string;
};

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    this.loggerService.error(exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const result = {} as ExceptionResponse;
    result.path = request.url;
    result['code'] = '50000';
    result.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    result.message = exception['details'] || exception['message'];
    if (exception instanceof HttpException) {
      const response = exception['response'];
      result.type = response?.type;
      result.path = request.url;
      result.code = response.code;
      result.statusCode = exception.getStatus();
      result.message =
        response['message'] || exception['message'] || exception['details'];
    }
    this.loggerService.error({
      ...result,
      query: request.query,
      body: request.body,
    });
    response.status(result.statusCode).json(result);
  }
}
