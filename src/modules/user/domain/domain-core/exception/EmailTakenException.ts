import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class EmailTakenException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.CONFLICT,
      param.message ?? 'Email already taken, please try another one',
      param.throwable ?? null,
    );
  }
}
