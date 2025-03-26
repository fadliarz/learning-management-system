import DomainException from './DomainException';

export default class HttpException extends DomainException {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
