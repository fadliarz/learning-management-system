import { Inject, Injectable } from '@nestjs/common';
import DeleteUserAssignmentCommand from './dto/DeleteUserAssignmentCommand';
import { UserAssignmentRepository } from '../../ports/output/repository/UserAssignmentRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class DeleteUserAssignmentCommandHandler {
  constructor(
    @Inject(DependencyInjection.USER_ASSIGNMENT_REPOSITORY)
    private readonly userAssignmentRepository: UserAssignmentRepository,
  ) {}

  public async execute(
    deleteUserAssignmentCommand: DeleteUserAssignmentCommand,
  ): Promise<void> {
    await this.userAssignmentRepository.deleteIfExistsAndAssignmentIsPersonalOrThrow(
      {
        ...deleteUserAssignmentCommand,
        userId: deleteUserAssignmentCommand.executor.userId,
      },
    );
  }
}
