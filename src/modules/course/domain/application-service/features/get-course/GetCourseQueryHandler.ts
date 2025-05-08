import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import CourseResponse from '../common/CourseResponse';
import GetCourseQuery from './dto/GetCourseQuery';
import Course from '../../../domain-core/entity/Course';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CourseCacheMemoryImpl from '../../../../data-access/cache/adapter/CourseCacheMemoryImpl';
import Category from '../../../../../category/domain/domain-core/entity/Category';
import CategoryResponse from '../../../../../category/domain/application-service/features/common/CategoryResponse';
import CategoryCacheMemoryImpl from '../../../../../category/data-access/cache/adapter/CategoryCacheMemoryImpl';

export default class GetCourseQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_CACHE_MEMORY)
    private readonly courseCacheMemory: CourseCacheMemoryImpl,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.CATEGORY_CACHE_MEMORY)
    private readonly categoryCacheMemory: CategoryCacheMemoryImpl,
  ) {}

  public async execute(
    getCourseQuery: GetCourseQuery,
  ): Promise<CourseResponse> {
    const cachedCourse: Course | null = await this.courseCacheMemory.get(
      getCourseQuery.courseId,
    );
    if (cachedCourse) return this.transform(cachedCourse);
    const course: Course = await this.courseRepository.findByIdOrThrow({
      ...getCourseQuery,
    });
    await this.courseCacheMemory.setAndSaveIndex({
      key: getCourseQuery.courseId,
      value: course,
    });
    return this.transform(course);
  }

  private async transform(course: Course): Promise<CourseResponse> {
    const courseResponse: CourseResponse = strictPlainToClass(
      CourseResponse,
      course,
    );
    courseResponse.categories = [];
    if (course.categories) {
      for (const categoryId of course.categories) {
        const category: Category | null =
          await this.categoryCacheMemory.get(categoryId);
        if (category) {
          courseResponse.categories.push(
            strictPlainToClass(CategoryResponse, category),
          );
        }
      }
    }
    return courseResponse;
  }
}
