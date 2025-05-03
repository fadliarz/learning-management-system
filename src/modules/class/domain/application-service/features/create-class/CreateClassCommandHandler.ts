import { Inject, Injectable } from '@nestjs/common';
import CreateClassCommand from './dto/CreateClassCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { ClassRepository } from '../../ports/output/repository/ClassRepository';
import Class from '../../../domain-core/entity/Class';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import ClassResponse from '../common/ClassResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class CreateClassCommandHandler {
  public constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.CLASS_REPOSITORY)
    private readonly classRepository: ClassRepository,
  ) {}

  public async execute(
    createClassCommand: CreateClassCommand,
  ): Promise<ClassResponse> {
    await this.authorizationService.authorizeManageCourse(
      createClassCommand.executor,
    );
    const courseClass = strictPlainToClass(Class, createClassCommand);
    courseClass.create();
    await this.classRepository.saveIfNotExistsOrThrow({
      courseClass,
    });
    return strictPlainToClass(ClassResponse, courseClass);
  }
}
