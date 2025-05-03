import HttpException from './HttpException';
import { HttpStatus } from '@nestjs/common';

export default class InternalServerException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown }) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      param.message ?? 'Please contact your provider (Internal Server Error)!',
      param.throwable ?? null,
    );
  }
}
