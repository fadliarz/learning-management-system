import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class CourseNotFoundException extends HttpException {
  constructor(message: string = 'Course not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
