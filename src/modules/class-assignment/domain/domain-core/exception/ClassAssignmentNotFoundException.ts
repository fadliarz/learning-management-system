import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ClassAssignmentNotFoundException extends HttpException {
  constructor(message: string = 'Class Assignment Not Found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
