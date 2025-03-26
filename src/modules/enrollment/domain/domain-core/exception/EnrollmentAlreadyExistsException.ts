import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class EnrollmentAlreadyExistsException extends HttpException {
  constructor(message: string = "You're already enrolled in this course") {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
