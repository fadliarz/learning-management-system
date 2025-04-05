import { Inject, Injectable } from '@nestjs/common';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { UserAssignmentRepository } from '../../ports/output/repository/UserAssignmentRepository';
import UserAssignmentResponse from '../common/UserAssignmentResponse';
import UpdateUserAssignmentCommand from './dto/UpdateUserAssignmentCommand';
import UserAssignment from '../../../domain-core/entity/UserAssignment';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import ClassUserAssignmentUpdationException from '../../../domain-core/exception/ClassUserAssignmentUpdationException';
import UserAssignmentNotFoundException from '../../../domain-core/exception/UserAssignmentNotFoundException';

@Injectable()
export default class UpdateUserAssignmentCommandHandler {
  constructor(
    @Inject(DependencyInjection.USER_ASSIGNMENT_REPOSITORY)
    private readonly userAssignmentRepository: UserAssignmentRepository,
  ) {}

  public async execute(
    updateUserAssignmentCommand: UpdateUserAssignmentCommand,
  ): Promise<UserAssignmentResponse> {
    const userAssignment: UserAssignment = strictPlainToClass(
      UserAssignment,
      updateUserAssignmentCommand,
    );
    userAssignment.userId = updateUserAssignmentCommand.executor.userId;
    await this.userAssignmentRepository.saveIfExistsAndAssignmentIsPersonalOrThrow(
      {
        userAssignment,
        notFoundException: new UserAssignmentNotFoundException(),
        domainException: new ClassUserAssignmentUpdationException(),
      },
    );
    return strictPlainToClass(UserAssignmentResponse, userAssignment);
  }
}
