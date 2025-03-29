import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class InstructorAlreadyExistsException extends HttpException {
  constructor(message: string = 'Instructor already exists') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
