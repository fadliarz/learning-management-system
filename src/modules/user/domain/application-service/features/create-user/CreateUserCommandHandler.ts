import { Inject, Injectable } from '@nestjs/common';
import CreateUserCommand from './dto/CreateUserCommand';
import UserResponse from '../common/UserResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import User from '../../../domain-core/entity/User';
import EmailTakenException from '../../../domain-core/exception/EmailTakenException';
import UserRepository from '../../ports/output/repository/UserRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class CreateUserCommandHandler {
  constructor(
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(
    createUserCommand: CreateUserCommand,
  ): Promise<UserResponse> {
    const user: User = strictPlainToClass(User, createUserCommand);
    user.create();
    await this.userRepository.saveIfEmailNotTakenOrThrow({
      user,
      domainException: new EmailTakenException(),
    });
    return strictPlainToClass(UserResponse, user);
  }
}
