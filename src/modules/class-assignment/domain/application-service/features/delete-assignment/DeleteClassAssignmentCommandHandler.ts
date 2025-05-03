import { Inject, Injectable } from '@nestjs/common';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ClassAssignmentRepository } from '../../ports/output/repository/ClassAssignmentRepository';
import DeleteClassAssignmentCommand from './dto/DeleteClassAssignmentCommand';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class DeleteClassAssignmentCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY)
    private readonly classAssignmentRepository: ClassAssignmentRepository,
  ) {}

  public async execute(
    deleteClassAssignmentCommand: DeleteClassAssignmentCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageClassAssignment(
      deleteClassAssignmentCommand.executor,
      deleteClassAssignmentCommand.classId,
    );
    await this.classAssignmentRepository.deleteIfExistsOrThrow({
      ...deleteClassAssignmentCommand,
    });
  }
}
