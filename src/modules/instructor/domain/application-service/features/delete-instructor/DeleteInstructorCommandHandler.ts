import { Inject, Injectable } from '@nestjs/common';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import DeleteInstructorCommand from './dto/DeleteInstructorCommand';
import InstructorRepository from '../../ports/output/InstructorRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class DeleteInstructorCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: InstructorRepository,
  ) {}

  public async execute(
    deleteInstructorCommand: DeleteInstructorCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      deleteInstructorCommand.executor,
    );
    await this.instructorRepository.deleteIfExistsOrThrow({
      ...deleteInstructorCommand,
    });
  }
}
