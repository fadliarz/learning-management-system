import AuthenticationException from './AuthenticationException';

export default class IncorrectRefreshTokenException extends AuthenticationException {
  constructor(message: string = 'Incorrect refresh token') {
    super(message);
  }
}
