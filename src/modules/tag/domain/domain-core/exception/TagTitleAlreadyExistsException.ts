import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class TagTitleAlreadyExistsException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.BAD_REQUEST,
      param.message ?? 'Tag name already exists',
      param.throwable ?? null,
    );
  }
}
