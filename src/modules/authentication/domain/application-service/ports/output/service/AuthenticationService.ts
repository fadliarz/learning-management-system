import { Tokens } from '../../../../domain-core/entity/Tokens';
import { AccessTokenPayload } from '../../../../domain-core/entity/AccessTokenPayload';
import { RefreshTokenPayload } from '../../../../domain-core/entity/RefreshTokenPayload';

export interface AuthenticationService {
  signIn(email: string, password: string): Promise<Tokens>;

  signOut(userId: number, refreshToken: string): Promise<void>;

  issueTokens(userId: number): Tokens & {
    accessTokenPayload: AccessTokenPayload;
    refreshTokenPayload: RefreshTokenPayload;
  };

  requestNewAccessToken(refreshToken: string): Promise<string>;
}
