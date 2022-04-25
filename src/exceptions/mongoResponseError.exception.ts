import { HttpException } from '@nestjs/common';
export class MongoResponseErrorException extends HttpException {
  constructor(message = null) {
    super(
      {
        type: 'MongoResponseErrorException',
        message,
        code: 502,
      },
      502,
    );
  }
}
