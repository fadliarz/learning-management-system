import { Inject, Injectable } from '@nestjs/common';
import UserRepository from '../../ports/output/repository/UserRepository';
import User from '../../../domain-core/entity/User';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import UserNotFoundException from '../../../domain-core/exception/UserNotFoundException';
import UpdateUserPasswordCommand from './dto/UpdateUserPasswordCommand';
import UserResponse from '../common/UserResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateUserPasswordCommandHandler {
  constructor(
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(
    updateUserPasswordCommand: UpdateUserPasswordCommand,
  ): Promise<UserResponse> {
    const user: User = strictPlainToClass(User, updateUserPasswordCommand);
    user.userId = updateUserPasswordCommand.executor.userId;
    user.update();
    await this.userRepository.saveIfExistsOrThrow({
      user,
      domainException: new UserNotFoundException(),
    });
    return strictPlainToClass(UserResponse, user);
  }
}
