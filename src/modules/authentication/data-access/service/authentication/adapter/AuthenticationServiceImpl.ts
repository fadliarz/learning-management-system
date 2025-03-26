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
import { UuidFactory } from '@nestjs/core/inspector/uuid-factory';
import UserNotFoundException from '../../../../../user/domain/domain-core/exception/UserNotFoundException';

@Injectable()
export default class AuthenticationServiceImpl
  implements AuthenticationService
{
  constructor(
    private readonly jwtService: JwtService,
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  public async signIn(email: string, password: string): Promise<Tokens> {
    const user: User = await this.userRepository.findByEmailOrThrow({
      email,
      domainException: new AuthenticationException(),
    });
    if (!(await bcrypt.compare(password, user.password))) {
      throw new AuthenticationException();
    }

    const now: number = Date.now();
    const accessTokenPayload: AccessTokenPayload = {
      userId: user.userId,
      expiredAt: now + 1000 * 60 * 60 * 3, // 3 hours
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      deviceId: UuidFactory.get(),
      userId: user.userId,
      expiredAt: now + Date.now() + 1000 * 60 * 60 * 24 * 90, // 30 days
    };
    const tokens: Tokens = {
      accessToken: this.generateAccessToken(accessTokenPayload),
      refreshToken: this.generateRefreshToken(refreshTokenPayload),
    };
    user.refreshTokens.filter((refreshToken: RefreshToken) => {
      return refreshToken.expiredAt > now;
    });
    user.refreshTokens.push({
      deviceId: refreshTokenPayload.deviceId,
      token: tokens.refreshToken,
      expiredAt: refreshTokenPayload.expiredAt,
    });
    await this.userRepository.saveIfExistsOrThrow({
      user,
      domainException: new UserNotFoundException(),
    });

    return tokens;
  }

  public async requestNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const now: number = Date.now();
      const refreshTokenPayload: RefreshTokenPayload =
        this.jwtService.verify(refreshToken);

      const user: User = await this.userRepository.findByIdOrThrow({
        userId: refreshTokenPayload.userId,
        domainException: new AuthenticationException(),
      });
      const myRefreshToken: RefreshToken[] = user.refreshTokens.filter(
        (refreshTokenObj: RefreshToken) => {
          return (
            refreshTokenObj.token === refreshToken &&
            refreshTokenObj.deviceId === refreshTokenPayload.deviceId // extra security
          );
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
          user,
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
    return this.jwtService.sign(accessTokenPayload);
  }

  private generateRefreshToken(
    refreshTokenPayload: RefreshTokenPayload,
  ): string {
    return this.jwtService.sign(refreshTokenPayload);
  }
}
