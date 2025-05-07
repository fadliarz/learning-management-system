import { HttpStatus } from '@nestjs/common';
import HttpException from '../../../../../common/common-domain/exception/HttpException';

export default class UserScheduleNotFoundException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.NOT_FOUND,
      param.message ?? 'User schedule not found',
      param.throwable ?? null,
    );
  }
}
