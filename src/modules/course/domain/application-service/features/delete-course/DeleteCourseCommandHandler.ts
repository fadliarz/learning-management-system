import DeleteCourseCommand from './dto/DeleteCourseCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CourseCacheMemoryImpl from '../../../../data-access/cache/adapter/CourseCacheMemoryImpl';

export default class DeleteCourseCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.COURSE_CACHE_MEMORY)
    private readonly courseCacheMemory: CourseCacheMemoryImpl,
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
    await this.courseCacheMemory.deleteAndRemoveIndex(
      deleteCourseCommand.courseId,
    );
  }
}
