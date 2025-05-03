import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class CategoryTitleAlreadyExistsException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.BAD_REQUEST,
      param.message ?? 'Category name already exists',
      param.throwable ?? null,
    );
  }
}
