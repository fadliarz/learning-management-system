import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class CategoryTitleAlreadyExistsException extends HttpException {
  constructor(message: string = 'Category name already exists') {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
