import HttpException from './HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ResourceConflictException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.CONFLICT,
      param.message ??
        'One or more related resources are being modified by another user. Please try again shortly!',
      param.throwable ?? null,
    );
  }
}
