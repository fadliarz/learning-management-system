import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class ScholarshipNotFoundException extends HttpException {
  constructor(message: string = 'Scholarship not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
