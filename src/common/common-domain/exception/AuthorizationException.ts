import HttpException from './HttpException';
import { HttpStatus } from '@nestjs/common';

export default class AuthorizationException extends HttpException {
  constructor(
    message: string = 'You are not authorized to perform this action',
  ) {
    super(HttpStatus.FORBIDDEN, message);
  }
}
