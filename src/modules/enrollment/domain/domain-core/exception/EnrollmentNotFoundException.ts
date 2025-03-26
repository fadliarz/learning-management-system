import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class EnrollmentNotFoundException extends HttpException {
  constructor(message: string = 'Enrollment not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
