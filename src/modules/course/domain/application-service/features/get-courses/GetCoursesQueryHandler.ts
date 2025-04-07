import { Inject, Injectable } from '@nestjs/common';
import GetCoursesQuery from './dto/GetCoursesQuery';
import Course from '../../../domain-core/entity/Course';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import CourseResponse from '../common/CourseResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CourseContext from '../../ports/output/context/CourseContext';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class GetCoursesQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_CONTEXT)
    private readonly courseContext: CourseContext,
  ) {}

  public async execute(
    getCoursesQuery: GetCoursesQuery,
  ): Promise<CourseResponse[]> {
    const courses: Course[] = await this.courseContext.findMany({
      pagination: strictPlainToClass(Pagination, getCoursesQuery),
    });
    return courses.map((course) => strictPlainToClass(CourseResponse, course));
  }
}
