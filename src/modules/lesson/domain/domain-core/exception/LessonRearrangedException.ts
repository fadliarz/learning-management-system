import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class LessonRearrangedException extends HttpException {
  constructor(param: { message?: string; throwable?: unknown } = {}) {
    super(
      HttpStatus.BAD_REQUEST,
      param.message ?? 'Lessons have been rearranged, please try again!',
      param.throwable,
    );
  }
}
