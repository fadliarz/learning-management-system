import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class EnrollmentNotFoundException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(HttpStatus.NOT_FOUND, param.message ?? 'Enrollment not found');
  }
}
