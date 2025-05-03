import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ClassAssignmentNotFoundException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.NOT_FOUND,
      param.message ?? 'Class Assignment Not Found',
      param.throwable,
    );
  }
}
