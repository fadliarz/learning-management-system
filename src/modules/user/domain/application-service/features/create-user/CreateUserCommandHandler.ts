import { Inject, Injectable } from '@nestjs/common';
import CreateUserCommand from './dto/CreateUserCommand';
import UserResponse from '../common/UserResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import User from '../../../domain-core/entity/User';
import UserRepository from '../../ports/output/repository/UserRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import { AuthenticationService } from '../../../../../authentication/domain/application-service/ports/output/service/AuthenticationService';
import * as bcrypt from 'bcrypt';
import GlobalConfig from '../../../../../../config/GlobalConfig';

@Injectable()
export default class CreateUserCommandHandler {
  constructor(
    private readonly globalConfig: GlobalConfig,
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(DependencyInjection.AUTHENTICATION_SERVICE)
    private readonly authenticationService: AuthenticationService,
  ) {}

  public async execute(createUserCommand: CreateUserCommand): Promise<{
    userResponse: UserResponse;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const user: User = strictPlainToClass(User, createUserCommand);
    const tokens = this.authenticationService.issueTokens(user.userId);
    user.refreshTokens = [
      {
        token: tokens.refreshToken,
        expiredAt: tokens.refreshTokenPayload.expiredAt,
      },
    ];
    user.password = await bcrypt.hash(
      user.password,
      this.globalConfig.SALT_ROUNDS,
    );
    user.create();
    await this.userRepository.saveIfEmailNotTakenOrThrow({
      user,
    });
    return {
      userResponse: strictPlainToClass(UserResponse, user),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }
}
