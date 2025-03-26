import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class UserAssignmentNotFoundException extends HttpException {
  constructor(message: string = 'User assignment not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
