import { Inject, Injectable } from '@nestjs/common';
import UserRepository from '../../ports/output/repository/UserRepository';
import UpdateUserProfileCommand from './dto/UpdateUserProfileCommand';
import UserResponse from '../common/UserResponse';
import User from '../../../domain-core/entity/User';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateUserProfileCommandHandler {
  constructor(
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(
    updateUserProfileCommand: UpdateUserProfileCommand,
  ): Promise<UserResponse> {
    const user: User = strictPlainToClass(User, updateUserProfileCommand);
    user.userId = updateUserProfileCommand.executor.userId;
    user.update();
    await this.userRepository.saveIfExistsOrThrow({
      user,
    });
    return strictPlainToClass(UserResponse, user);
  }
}
