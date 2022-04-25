import { HttpException } from '@nestjs/common';
export class RedisResponseErrorException extends HttpException {
  constructor(message = null) {
    super(
      {
        type: 'RedisResponseErrorException',
        message,
        code: 5000,
      },
      500,
    );
  }
}
