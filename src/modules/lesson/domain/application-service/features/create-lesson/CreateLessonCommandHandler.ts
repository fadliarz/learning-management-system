import { Inject, Injectable } from '@nestjs/common';
import LessonResponse from '../common/LessonResponse';
import CreateLessonCommand from './dto/CreateLessonCommand';
import { LessonRepository } from '../../ports/output/LessonRepository';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Lesson from '../../../domain-core/entity/Lesson';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';

@Injectable()
export default class CreateLessonCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.LESSON_REPOSITORY)
    private readonly lessonRepository: LessonRepository,
  ) {}

  public async execute(
    createLessonCommand: CreateLessonCommand,
  ): Promise<LessonResponse> {
    await this.authorizationService.authorizeManageCourse(
      createLessonCommand.executor,
    );
    const lesson: Lesson = strictPlainToClass(Lesson, createLessonCommand);
    lesson.create();
    await this.lessonRepository.saveIfNotExistsOrThrow({
      lesson,
      domainException: new DomainException(),
    });
    return strictPlainToClass(LessonResponse, lesson);
  }
}
