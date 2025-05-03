import DeleteCourseCommand from './dto/DeleteCourseCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

export default class DeleteCourseCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async execute(
    deleteCourseCommand: DeleteCourseCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      deleteCourseCommand.executor,
    );
    await this.courseRepository.deleteIfExistsOrThrow({
      ...deleteCourseCommand,
    });
  }
}
