import { HttpStatus } from '@nestjs/common';
import HttpException from '../../../../../common/common-domain/exception/HttpException';

export default class UserScheduleNotFoundException extends HttpException {
  constructor(message: string = 'User schedule not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
