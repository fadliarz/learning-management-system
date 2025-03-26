import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class IncorrectPasswordException extends HttpException {
  constructor(message: string = 'Incorrect password') {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
