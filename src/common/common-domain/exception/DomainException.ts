import { RuntimeException } from '@nestjs/core/errors/exceptions';

export default class DomainException extends RuntimeException {
  constructor(message?: string) {
    if (message) {
      super(message);
    } else {
      super();
    }
  }
}
