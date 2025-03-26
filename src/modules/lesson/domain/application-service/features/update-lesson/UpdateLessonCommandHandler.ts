import UpdateLessonCommand from './dto/UpdateLessonCommand';
import { Inject, Injectable } from '@nestjs/common';
import Lesson from '../../../domain-core/entity/Lesson';
import { LessonRepository } from '../../ports/output/LessonRepository';
import LessonNotFoundException from '../../../domain-core/exception/LessonNotFoundException';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import LessonResponse from '../common/LessonResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateLessonCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.LESSON_REPOSITORY)
    private readonly lessonRepository: LessonRepository,
  ) {}

  public async execute(
    updateLessonCommand: UpdateLessonCommand,
  ): Promise<LessonResponse> {
    await this.authorizationService.authorizeManageCourse(
      updateLessonCommand.executor,
    );
    const lesson: Lesson = strictPlainToClass(Lesson, updateLessonCommand);
    lesson.update();
    await this.lessonRepository.saveIfExistsOrThrow({
      lesson,
      domainException: new LessonNotFoundException(),
    });
    return strictPlainToClass(LessonResponse, lesson);
  }
}
