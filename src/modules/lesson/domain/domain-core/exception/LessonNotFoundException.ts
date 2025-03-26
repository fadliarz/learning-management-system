import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class LessonNotFoundException extends HttpException {
  constructor(message: string = 'Lesson not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
