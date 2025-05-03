import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class InstructorAlreadyExistsException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.NOT_FOUND,
      param.message ?? 'Instructor already exists',
      param.throwable ?? null,
    );
  }
}
