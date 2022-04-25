import { HttpException } from '@nestjs/common';
export class NotFoundErrorException extends HttpException {
  constructor(message = null) {
    super(
      {
        type: 'NotFoundErrorException',
        message,
        code: 404,
      },
      404,
    );
  }
}
