import { Inject, Injectable } from '@nestjs/common';
import UpdateClassAssignmentCommand from './dto/UpdateClassAssignmentCommand';
import ClassAssignmentResponse from '../common/ClassAssignmentResponse';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ClassAssignmentRepository } from '../../ports/output/repository/ClassAssignmentRepository';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import ClassAssignment from '../../../domain-core/entity/ClassAssignment';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateClassAssignmentCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY)
    private readonly classAssignmentRepository: ClassAssignmentRepository,
  ) {}

  public async execute(
    updateClassAssignmentCommand: UpdateClassAssignmentCommand,
  ): Promise<ClassAssignmentResponse> {
    await this.authorizationService.authorizeManageClassAssignment(
      updateClassAssignmentCommand.executor,
      updateClassAssignmentCommand.classId,
    );
    const classAssignment: ClassAssignment = strictPlainToClass(
      ClassAssignment,
      updateClassAssignmentCommand,
    );
    classAssignment.update();
    await this.classAssignmentRepository.saveIfExistsOrThrow({
      classAssignment,
    });
    return strictPlainToClass(ClassAssignmentResponse, classAssignment);
  }
}
