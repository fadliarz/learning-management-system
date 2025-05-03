import { Inject, Injectable } from '@nestjs/common';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import DeleteLessonCommand from './dto/DeleteLessonCommand';
import { LessonRepository } from '../../ports/output/LessonRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class DeleteLessonCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.LESSON_REPOSITORY)
    private readonly lessonRepository: LessonRepository,
  ) {}

  public async execute(
    deleteLessonCommand: DeleteLessonCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      deleteLessonCommand.executor,
    );
    await this.lessonRepository.deleteIfExistsOrThrow({
      ...deleteLessonCommand,
    });
  }
}
