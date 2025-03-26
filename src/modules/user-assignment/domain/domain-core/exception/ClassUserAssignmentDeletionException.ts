import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ClassUserAssignmentDeletionException extends HttpException {
  constructor(message: string = 'Class user assignment cannot be deleted') {
    super(HttpStatus.FORBIDDEN, message);
  }
}
