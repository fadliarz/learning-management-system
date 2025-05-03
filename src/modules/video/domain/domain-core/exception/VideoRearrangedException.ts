import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class VideoRearrangedException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.BAD_REQUEST,
      param.message ?? 'Videos have been rearranged, please try again!',
      param.throwable ?? null,
    );
  }
}
