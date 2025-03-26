import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class VideoRearrangedException extends HttpException {
  constructor(
    message: string = 'Failed to update position, videos have been rearranged, please try again!',
  ) {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
