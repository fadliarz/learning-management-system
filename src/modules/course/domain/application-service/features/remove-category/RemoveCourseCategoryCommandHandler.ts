import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import RemoveCourseCategoryCommand from './dto/RemoveCourseCategoryCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import Course from '../../../domain-core/entity/Course';
import CourseCacheMemoryImpl from '../../../../data-access/cache/adapter/CourseCacheMemoryImpl';

@Injectable()
export default class RemoveCourseCategoryCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.COURSE_CACHE_MEMORY)
    private readonly courseCacheMemory: CourseCacheMemoryImpl,
  ) {}

  public async execute(
    removeCourseCategoryCommand: RemoveCourseCategoryCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      removeCourseCategoryCommand.executor,
    );
    await this.courseRepository.removeCategoryIfExistsOrIgnore(
      removeCourseCategoryCommand,
    );
    const course: Course | null = await this.courseRepository.findById({
      courseId: removeCourseCategoryCommand.courseId,
    });
    if (course) {
      await this.courseCacheMemory.setAndSaveIndex({
        key: removeCourseCategoryCommand.courseId,
        value: course,
      });
    }
  }
}
