import { Inject, Injectable } from '@nestjs/common';
import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import GetCoursesQuery from './dto/GetCoursesQuery';
import Course from '../../../domain-core/entity/Course';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import PaginationDto from '../../../../../../common/common-domain/PaginationDto';
import CourseResponse from '../common/CourseResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetCoursesQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async execute(
    getCoursesQuery: GetCoursesQuery,
  ): Promise<CourseResponse[]> {
    const courses: Course[] = await this.courseRepository.findMany({
      ...getCoursesQuery,
      pagination: strictPlainToClass(PaginationDto, getCoursesQuery),
    });
    return courses.map((course) => strictPlainToClass(CourseResponse, course));
  }
}
