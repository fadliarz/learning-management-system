import HttpException from './HttpException';
import { HttpStatus } from '@nestjs/common';

export default class DuplicateKeyException extends HttpException {
  constructor(message: string = 'Something went wrong, please try again!') {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
