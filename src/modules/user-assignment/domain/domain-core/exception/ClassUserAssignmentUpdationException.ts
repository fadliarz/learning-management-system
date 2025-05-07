import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ClassUserAssignmentUpdationException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.BAD_REQUEST,
      param.message ?? 'Class user assignment cannot be updated',
      param.throwable ?? null,
    );
  }
}
