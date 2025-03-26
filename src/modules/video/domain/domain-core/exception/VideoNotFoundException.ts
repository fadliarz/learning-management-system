import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class VideoNotFoundException extends HttpException {
  constructor(message: string = 'Video not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
