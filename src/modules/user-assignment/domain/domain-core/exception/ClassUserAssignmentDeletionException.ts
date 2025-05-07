import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ClassUserAssignmentDeletionException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.FORBIDDEN,
      param.message ?? 'Class user assignment cannot be deleted',
      param.throwable ?? null,
    );
  }
}
