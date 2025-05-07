import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class EmailTakenException extends HttpException {
  constructor(message: string = 'Email already taken, please try another one') {
    super(HttpStatus.CONFLICT, message);
  }
}
