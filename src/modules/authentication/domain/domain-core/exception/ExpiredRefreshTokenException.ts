import AuthenticationException from './AuthenticationException';

export default class ExpiredRefreshTokenException extends AuthenticationException {
  constructor(message: string = 'Expired refresh token, please sign in again') {
    super(message);
  }
}
