import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import AddCourseCategoryCommand from './dto/AddCourseCategoryCommand';
import { CategoryRepository } from '../../../../../category/domain/application-service/ports/output/repository/CategoryRepository';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import CourseCacheMemoryImpl from '../../../../data-access/cache/adapter/CourseCacheMemoryImpl';
import Course from '../../../domain-core/entity/Course';

@Injectable()
export default class AddCourseCategoryCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(DependencyInjection.COURSE_CACHE_MEMORY)
    private readonly courseCacheMemory: CourseCacheMemoryImpl,
  ) {}

  public async execute(
    addCourseCategoryCommand: AddCourseCategoryCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      addCourseCategoryCommand.executor,
    );
    await this.categoryRepository.findByIdOrThrow({
      categoryId: addCourseCategoryCommand.categoryId,
    });
    await this.courseRepository.addCategoryIfNotExistsOrIgnore(
      addCourseCategoryCommand,
    );
    const course: Course | null = await this.courseRepository.findById({
      courseId: addCourseCategoryCommand.courseId,
    });
    if (course) {
      await this.courseCacheMemory.setAndSaveIndex({
        key: addCourseCategoryCommand.courseId,
        value: course,
      });
    }
    await this.courseCacheMemory.deleteAndRemoveIndex(
      addCourseCategoryCommand.courseId,
    );
    return;
  }
}
