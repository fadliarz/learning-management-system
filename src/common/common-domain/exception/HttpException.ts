import DomainException from './DomainException';

export default class HttpException extends DomainException {
  public statusCode: number;
  public throwable: unknown;

  constructor(statusCode: number, message: string, throwable: unknown = null) {
    super(message);
    this.statusCode = statusCode;
    this.throwable = throwable;
  }
}
