import HttpException from './HttpException';
import { HttpStatus } from '@nestjs/common';

export default class DuplicateKeyException extends HttpException {
  constructor(param: { message?: string; throwable?: Error }) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      param.message ?? 'Something went wrong, please try again!',
      param.throwable ?? null,
    );
  }
}
