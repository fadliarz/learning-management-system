import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class CourseScheduleNotFoundException extends HttpException {
  constructor(message: string = 'Course schedule not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
