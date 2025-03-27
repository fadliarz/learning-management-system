import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Tokens } from '../../domain/domain-core/entity/Tokens';
import CookieConfig from '../../../../config/CookieConfig';
import SignInCommandHandler from '../../domain/application-service/features/sign-in/SignInCommandHandler';
import SignInDto from '../../domain/application-service/features/sign-in/dto/SignInDto';
import SignOutCommandHandler from '../../domain/application-service/features/sign-out/SignOutCommandHandler';
import { AuthenticationGuard } from '../../domain/application-service/AuthenticationGuard';

@Controller('api/v1/authentication')
@ApiTags('Authentication')
export default class AuthenticationController {
  constructor(
    private readonly cookieConfig: CookieConfig,
    private readonly signInCommandHandler: SignInCommandHandler,
    private readonly signOutCommandHandler: SignOutCommandHandler,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in successfully',
  })
  public async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<void> {
    const tokens: Tokens = await this.signInCommandHandler.execute(signInDto);
    response.setCookie(this.cookieConfig.ACCESS_TOKEN_KEY, tokens.accessToken, {
      httpOnly: true,
      secure: true,
      path: '/',
    });
    response.setCookie(
      this.cookieConfig.REFRESH_TOKEN_KEY,
      tokens.refreshToken,
      {
        httpOnly: true,
        secure: true,
        path: '/',
      },
    );
  }

  @UseGuards(AuthenticationGuard)
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed out successfully',
  })
  public async signOut(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<void> {
    await this.signOutCommandHandler.execute({
      executor: request.executor,
      refreshToken: request.cookies[
        this.cookieConfig.REFRESH_TOKEN_KEY
      ] as string,
    });
    response.clearCookie(this.cookieConfig.ACCESS_TOKEN_KEY);
    response.clearCookie(this.cookieConfig.REFRESH_TOKEN_KEY);
  }
}
