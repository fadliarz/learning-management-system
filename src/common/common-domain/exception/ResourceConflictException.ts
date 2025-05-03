import HttpException from './HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ResourceConflictException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.CONFLICT,
      param.message ??
        'The resource is currently being modified by another user. Please try again in a moment!',
      param.throwable ?? null,
    );
  }
}
