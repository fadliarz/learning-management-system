import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class AuthenticationException extends HttpException {
  constructor(message: string = "You're not authenticated, please sign in!") {
    super(HttpStatus.UNAUTHORIZED, message);
  }
}
