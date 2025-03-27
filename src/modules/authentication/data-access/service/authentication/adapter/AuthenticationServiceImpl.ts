import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationService } from '../../../../domain/application-service/ports/output/service/AuthenticationService';
import { JwtService } from '@nestjs/jwt';
import UserRepository from '../../../../../user/domain/application-service/ports/output/repository/UserRepository';
import AuthenticationException from '../../../../domain/domain-core/exception/AuthenticationException';
import * as bcrypt from 'bcrypt';
import User from '../../../../../user/domain/domain-core/entity/User';
import { RefreshToken } from '../../../../../user/domain/domain-core/entity/RefreshToken';
import { AccessTokenPayload } from '../../../../domain/domain-core/entity/AccessTokenPayload';
import { RefreshTokenPayload } from '../../../../domain/domain-core/entity/RefreshTokenPayload';
import { Tokens } from '../../../../domain/domain-core/entity/Tokens';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import UserNotFoundException from '../../../../../user/domain/domain-core/exception/UserNotFoundException';
import CookieConfig from '../../../../../../config/CookieConfig';
import IncorrectPasswordException from '../../../../domain/domain-core/exception/IncorrectPasswordException';

@Injectable()
export default class AuthenticationServiceImpl
  implements AuthenticationService
{
  constructor(
    private readonly cookieConfig: CookieConfig,
    private readonly jwtService: JwtService,
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  public async signIn(email: string, password: string): Promise<Tokens> {
    const user: User = await this.userRepository.findByEmailOrThrow({
      email,
      domainException: new UserNotFoundException(),
    });
    if (!(await bcrypt.compare(password, user.password))) {
      throw new IncorrectPasswordException();
    }

    const now: number = Date.now();
    const accessTokenPayload: AccessTokenPayload = {
      userId: user.userId,
      expiredAt: now + 1000 * 60 * 60 * 3, // 3 hours
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      userId: user.userId,
      expiredAt: now + Date.now() + 1000 * 60 * 60 * 24 * 90, // 90 days
    };
    const tokens: Tokens = {
      accessToken: this.generateAccessToken(accessTokenPayload),
      refreshToken: this.generateRefreshToken(refreshTokenPayload),
    };
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = [];
    }
    user.refreshTokens.filter((refreshToken: RefreshToken) => {
      return refreshToken.expiredAt > now;
    });
    user.refreshTokens.push({
      token: tokens.refreshToken,
      expiredAt: refreshTokenPayload.expiredAt,
    });
    await this.userRepository.saveIfExistsOrThrow({
      user: { userId: user.userId, refreshTokens: user.refreshTokens } as User,
      domainException: new UserNotFoundException(),
    });

    return tokens;
  }

  public async signOut(userId: number, refreshToken: string): Promise<void> {
    const user: User = await this.userRepository.findByIdOrThrow({
      userId,
      domainException: new AuthenticationException(),
    });
    const now: number = Date.now();
    user.refreshTokens.filter((refreshTokenObj: RefreshToken) => {
      return (
        refreshTokenObj.expiredAt > now &&
        refreshTokenObj.token !== refreshToken
      );
    });
    await this.userRepository.saveIfExistsOrThrow({
      user: { userId: user.userId, refreshTokens: user.refreshTokens } as User,
      domainException: new AuthenticationException(),
    });
  }

  public issueTokens(userId: number): Tokens & {
    accessTokenPayload: AccessTokenPayload;
    refreshTokenPayload: RefreshTokenPayload;
  } {
    const now: number = Date.now();
    const accessTokenPayload: AccessTokenPayload = {
      userId,
      expiredAt: now + 1000 * 60 * 60 * 3, // 3 hours
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      userId,
      expiredAt: now + Date.now() + 1000 * 60 * 60 * 24 * 90, // 90 days
    };
    return {
      accessToken: this.generateAccessToken(accessTokenPayload),
      accessTokenPayload,
      refreshToken: this.generateRefreshToken(refreshTokenPayload),
      refreshTokenPayload,
    };
  }

  public async requestNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const now: number = Date.now();
      const refreshTokenPayload: RefreshTokenPayload =
        this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
          secret: this.cookieConfig.COOKIE_SECRET_KEY,
        });

      const user: User = await this.userRepository.findByIdOrThrow({
        userId: refreshTokenPayload.userId,
        domainException: new AuthenticationException(),
      });
      const myRefreshToken: RefreshToken[] = user.refreshTokens.filter(
        (refreshTokenObj: RefreshToken) => {
          return refreshTokenObj.token === refreshToken;
        },
      );
      if (myRefreshToken.length === 0) {
        throw new AuthenticationException();
      }

      const initialLength: number = user.refreshTokens.length;
      user.refreshTokens.filter((refreshToken: RefreshToken): boolean => {
        return refreshToken.expiredAt > now;
      });
      if (user.refreshTokens.length < initialLength) {
        await this.userRepository.saveIfExistsOrThrow({
          user: {
            userId: user.userId,
            refreshTokens: user.refreshTokens,
          } as User,
          domainException: new AuthenticationException(),
        });
      }

      return this.generateAccessToken({
        userId: user.userId,
        expiredAt: now + 1000 * 60 * 60 * 3, // 3 hours
      });
    } catch (exception) {
      throw new AuthenticationException();
    }
  }

  private generateAccessToken(accessTokenPayload: AccessTokenPayload): string {
    return this.jwtService.sign(accessTokenPayload, {
      secret: this.cookieConfig.COOKIE_SECRET_KEY,
    });
  }

  private generateRefreshToken(
    refreshTokenPayload: RefreshTokenPayload,
  ): string {
    return this.jwtService.sign(refreshTokenPayload, {
      secret: this.cookieConfig.COOKIE_SECRET_KEY,
    });
  }
}
