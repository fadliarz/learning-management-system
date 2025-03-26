import { Tokens } from '../../../../domain-core/entity/Tokens';

export interface AuthenticationService {
  signIn(email: string, password: string): Promise<Tokens>;

  requestNewAccessToken(refreshToken: string): Promise<string>;
}
