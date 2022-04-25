import { HttpException } from '@nestjs/common';
export class ValidationErrorException extends HttpException {
  constructor(message = null) {
    super(
      {
        type: 'ValidationErrorException',
        message,
        code: 405,
      },
      405,
    );
  }
}
