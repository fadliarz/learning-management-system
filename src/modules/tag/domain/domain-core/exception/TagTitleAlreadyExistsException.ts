import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class TagTitleAlreadyExistsException extends HttpException {
  constructor(message: string = 'Tag name already exists') {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
