import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class InstructorNotFoundException extends HttpException {
  constructor(message: string = 'Instructor not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
