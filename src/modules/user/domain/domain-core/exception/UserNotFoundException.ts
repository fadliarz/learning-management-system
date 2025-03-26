import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class UserNotFoundException extends HttpException {
  constructor(message: string = 'User not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
