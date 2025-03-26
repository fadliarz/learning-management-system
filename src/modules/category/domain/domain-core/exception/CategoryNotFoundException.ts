import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class CategoryNotFoundException extends HttpException {
  constructor(message: string = 'Category not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
