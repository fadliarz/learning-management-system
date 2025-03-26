import { Inject, Injectable } from '@nestjs/common';
import UpdateLessonPositionCommand from './dto/UpdateLessonPositionCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { LessonRepository } from '../../ports/output/LessonRepository';
import LessonRearrangedException from '../../../domain-core/exception/LessonRearrangedException';
import Lesson from '../../../domain-core/entity/Lesson';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateLessonPositionCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.LESSON_REPOSITORY)
    private readonly lessonRepository: LessonRepository,
  ) {}

  public async execute(
    updateLessonPositionCommand: UpdateLessonPositionCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      updateLessonPositionCommand.executor,
    );
    await this.lessonRepository.updateLessonPositionOrThrow({
      lesson: this.updateLessonPositionCommandToLesson(
        updateLessonPositionCommand,
      ),
      upperLesson: this.updateLessonPositionCommandToUpperLesson(
        updateLessonPositionCommand,
      ),
      lowerLesson: this.updateLessonPositionCommandToLowerLesson(
        updateLessonPositionCommand,
      ),
      version: updateLessonPositionCommand.version,
      domainException: new LessonRearrangedException(),
    });
  }

  private updateLessonPositionCommandToLesson(
    updateLessonPositionCommand: UpdateLessonPositionCommand,
  ): Lesson {
    const lesson: Lesson = new Lesson();
    lesson.lessonId = updateLessonPositionCommand.lessonId;
    lesson.courseId = updateLessonPositionCommand.courseId;
    return lesson;
  }

  private updateLessonPositionCommandToUpperLesson(
    updateLessonPositionCommand: UpdateLessonPositionCommand,
  ): Lesson | null {
    if (
      !updateLessonPositionCommand.upperLessonId ||
      !updateLessonPositionCommand.upperLessonPosition
    )
      return null;
    const lesson: Lesson = new Lesson();
    lesson.lessonId = updateLessonPositionCommand.upperLessonId;
    lesson.courseId = updateLessonPositionCommand.courseId;
    lesson.position = updateLessonPositionCommand.upperLessonPosition;
    return lesson;
  }

  private updateLessonPositionCommandToLowerLesson(
    updateLessonPositionCommand: UpdateLessonPositionCommand,
  ): Lesson | null {
    if (
      !updateLessonPositionCommand.lowerLessonId ||
      !updateLessonPositionCommand.lowerLessonPosition
    )
      return null;

    const lesson: Lesson = new Lesson();
    lesson.lessonId = updateLessonPositionCommand.lowerLessonId;
    lesson.courseId = updateLessonPositionCommand.courseId;
    lesson.position = updateLessonPositionCommand.lowerLessonPosition;
    return lesson;
  }
}
