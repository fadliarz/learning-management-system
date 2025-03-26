import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class LessonRearrangedException extends HttpException {
  constructor(
    message: string = 'Failed to update position, lessons have been rearranged, please try again!',
  ) {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
