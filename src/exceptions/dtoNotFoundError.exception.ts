import { HttpException } from '@nestjs/common';
export class DtoNotFoundErrorException extends HttpException {
  constructor(message = null) {
    super(
      {
        type: 'DtoNotFoundErrorException',
        message,
        code: 400,
      },
      400,
    );
  }
}
