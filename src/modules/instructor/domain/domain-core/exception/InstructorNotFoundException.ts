import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class InstructorNotFoundException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.NOT_FOUND,
      param.message ?? 'Instructor not found',
      param.throwable ?? null,
    );
  }
}
