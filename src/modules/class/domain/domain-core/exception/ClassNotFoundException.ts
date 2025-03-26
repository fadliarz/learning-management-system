import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ClassNotFoundException extends HttpException {
  constructor(message: string = 'Class not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
