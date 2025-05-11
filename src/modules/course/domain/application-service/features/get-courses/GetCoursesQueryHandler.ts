import { Inject, Injectable } from '@nestjs/common';
import GetCoursesQuery from './dto/GetCoursesQuery';
import Course from '../../../domain-core/entity/Course';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import CourseResponse from '../common/CourseResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import Category from '../../../../../category/domain/domain-core/entity/Category';
import CategoryResponse from '../../../../../category/domain/application-service/features/common/CategoryResponse';
import CourseHelper from '../../CourseHelper';
import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import CourseCacheMemoryImpl from '../../../../data-access/cache/adapter/CourseCacheMemoryImpl';
import CategoryCacheMemoryImpl from '../../../../../category/data-access/cache/adapter/CategoryCacheMemoryImpl';
import { CategoryRepository } from '../../../../../category/domain/application-service/ports/output/repository/CategoryRepository';

@Injectable()
export default class GetCoursesQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_CACHE_MEMORY)
    private readonly courseCacheMemory: CourseCacheMemoryImpl,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.CATEGORY_CACHE_MEMORY)
    private readonly categoryCacheMemory: CategoryCacheMemoryImpl,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async execute(
    getCoursesQuery: GetCoursesQuery,
  ): Promise<CourseResponse[]> {
    const courseIds: number[] = await this.courseCacheMemory.getKeysByIndex();
    let courses: Course[] = [];
    for (const courseId of courseIds) {
      let course: Course | null = await this.courseCacheMemory.get(courseId);
      if (course) {
        courses.push(course);
        continue;
      }
      course = await this.courseRepository.findById({ courseId });
      if (course) {
        courses.push(course);
        continue;
      }
      await this.courseCacheMemory.deleteAndRemoveIndex(courseId);
    }
    if (getCoursesQuery.categories) {
      courses = CourseHelper.filterByCategories(
        courses,
        getCoursesQuery.categories,
      );
    }
    courses = CourseHelper.paginate(
      courses,
      strictPlainToClass(Pagination, getCoursesQuery),
    );
    return await this.transform(courses);
  }

  private async transform(courses: Course[]): Promise<CourseResponse[]> {
    const courseResponses: CourseResponse[] = [];
    for (const course of courses) {
      const courseResponse: CourseResponse = strictPlainToClass(
        CourseResponse,
        course,
      );
      courseResponse.categories = [];
      for (const categoryId of course.categories ?? []) {
        let category: Category | null =
          await this.categoryCacheMemory.get(categoryId);
        if (!category) {
          category = await this.categoryRepository.findById({
            categoryId: categoryId,
          });
          if (category) {
            await this.categoryCacheMemory.setAndSaveIndex({
              key: categoryId,
              value: category,
            });
          }
        }
        if (category) {
          courseResponse.categories.push(
            strictPlainToClass(CategoryResponse, category),
          );
        }
      }
      courseResponses.push(courseResponse);
    }
    return courseResponses;
  }
}
