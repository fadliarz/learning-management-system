import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class TagNotFoundException extends HttpException {
  constructor(message: string = 'Tag not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
