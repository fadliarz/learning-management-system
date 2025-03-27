import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthenticationService } from './ports/output/service/AuthenticationService';
import { FastifyRequest } from 'fastify';
import AuthenticationException from '../domain-core/exception/AuthenticationException';
import { JwtService } from '@nestjs/jwt';
import UserRepository from '../../../user/domain/application-service/ports/output/repository/UserRepository';
import User from '../../../user/domain/domain-core/entity/User';
import { AccessTokenPayload } from '../domain-core/entity/AccessTokenPayload';
import { DependencyInjection } from '../../../../common/common-domain/DependencyInjection';
import CookieConfig from '../../../../config/CookieConfig';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly cookieConfig: CookieConfig,
    private readonly jwtService: JwtService,
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(DependencyInjection.AUTHENTICATION_SERVICE)
    private readonly authenticationService: AuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context
      .switchToHttp()
      .getRequest<FastifyRequest>();

    const accessToken: string | undefined =
      request.cookies[this.cookieConfig.ACCESS_TOKEN_KEY];
    if (!accessToken) {
      throw new AuthenticationException();
    }

    try {
      const accessTokenPayload: AccessTokenPayload =
        this.jwtService.verify<AccessTokenPayload>(accessToken, {
          secret: this.cookieConfig.COOKIE_SECRET_KEY,
        });
      const now: number = Date.now();
      if (accessTokenPayload.expiredAt <= now) {
        const refreshToken: string | undefined =
          request.cookies[this.cookieConfig.REFRESH_TOKEN_KEY];
        if (!refreshToken) {
          throw new AuthenticationException();
        }
        await this.authenticationService.requestNewAccessToken(refreshToken);
      }

      const user: User = await this.userRepository.findByIdOrThrow({
        userId: accessTokenPayload.userId,
        domainException: new AuthenticationException(),
      });
      user.refreshTokens = [];
      request.executor = user;
    } catch (exception) {
      throw new AuthenticationException();
    }

    return true;
  }
}
