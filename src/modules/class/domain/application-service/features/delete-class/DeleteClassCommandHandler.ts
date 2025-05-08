import { Inject, Injectable } from '@nestjs/common';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import DeleteClassCommand from './dto/DeleteClassCommand';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import { ClassRepository } from '../../ports/output/repository/ClassRepository';

@Injectable()
export default class DeleteClassCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.CLASS_REPOSITORY)
    private readonly classRepository: ClassRepository,
  ) {}

  public async execute(deleteClassCommand: DeleteClassCommand): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      deleteClassCommand.executor,
    );
    await this.classRepository.deleteIfExistsOrThrow({
      ...deleteClassCommand,
    });
  }
}
