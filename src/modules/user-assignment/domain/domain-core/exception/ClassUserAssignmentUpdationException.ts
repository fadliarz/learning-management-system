import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ClassUserAssignmentUpdationException extends HttpException {
  constructor(message: string = 'Class user assignment cannot be updated') {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
