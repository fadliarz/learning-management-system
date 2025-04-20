import { Inject, Injectable } from '@nestjs/common';
import GetCoursesQuery from './dto/GetCoursesQuery';
import Course from '../../../domain-core/entity/Course';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import CourseResponse from '../common/CourseResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CourseContext from '../../ports/output/context/CourseContext';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import CategoryContext from '../../../../../category/domain/application-service/ports/output/context/CategoryContext';
import Category from '../../../../../category/domain/domain-core/entity/Category';
import CategoryResponse from '../../../../../category/domain/application-service/features/common/CategoryResponse';
import TimerService from '../../../../../../common/common-domain/TimerService';

@Injectable()
export default class GetCoursesQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_CONTEXT)
    private readonly courseContext: CourseContext,
    @Inject(DependencyInjection.CATEGORY_CONTEXT)
    private readonly categoryContext: CategoryContext,
  ) {}

  public async execute(
    getCoursesQuery: GetCoursesQuery,
  ): Promise<CourseResponse[]> {
    await TimerService.sleepInMilliseconds(20);
    const courses: Course[] = await this.courseContext.findMany({
      ...getCoursesQuery,
      pagination: strictPlainToClass(Pagination, getCoursesQuery),
    });
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
      for (const categoryId of course.categories) {
        const category: Category | undefined =
          await this.categoryContext.findById({
            categoryId,
          });
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
