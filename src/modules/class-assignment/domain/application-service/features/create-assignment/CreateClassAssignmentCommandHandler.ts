import { Inject, Injectable } from '@nestjs/common';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ClassAssignmentRepository } from '../../ports/output/repository/ClassAssignmentRepository';
import CreateClassAssignmentCommand from './dto/CreateClassAssignmentCommand';
import ClassAssignmentResponse from '../common/ClassAssignmentResponse';
import ClassAssignment from '../../../domain-core/entity/ClassAssignment';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class CreateClassAssignmentCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY)
    private readonly classAssignmentRepository: ClassAssignmentRepository,
  ) {}

  public async execute(
    createClassAssignmentCommand: CreateClassAssignmentCommand,
  ): Promise<ClassAssignmentResponse> {
    await this.authorizationService.authorizeManageClassAssignment(
      createClassAssignmentCommand.executor,
      createClassAssignmentCommand.classId,
    );
    const classAssignment: ClassAssignment = strictPlainToClass(
      ClassAssignment,
      createClassAssignmentCommand,
    );
    classAssignment.create();
    await this.classAssignmentRepository.saveIfNotExistsOrThrow({
      classAssignment,
    });
    return strictPlainToClass(ClassAssignmentResponse, classAssignment);
  }
}
