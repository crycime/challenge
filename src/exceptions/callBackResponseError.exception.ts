import { HttpException } from '@nestjs/common';
export class CallBackResponseErrorException extends HttpException {
  constructor(message = null) {
    super(
      {
        type: 'CallBackResponseErrorException',
        message,
        code: 50002,
      },
      502,
    );
  }
}
