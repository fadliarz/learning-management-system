import HttpException from '../../../../../common/common-domain/exception/HttpException';
import { HttpStatus } from '@nestjs/common';

export default class AttachmentNotFoundException extends HttpException {
  constructor(message: string = 'Attachment not found') {
    super(HttpStatus.NOT_FOUND, message);
  }
}
