import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class CourseNotFoundException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.NOT_FOUND,
      param.message ?? 'Course not found',
      param.throwable ?? null,
    );
  }
}
