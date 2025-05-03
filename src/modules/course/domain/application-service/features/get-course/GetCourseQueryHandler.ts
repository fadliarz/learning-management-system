import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import CourseResponse from '../common/CourseResponse';
import GetCourseQuery from './dto/GetCourseQuery';
import Course from '../../../domain-core/entity/Course';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

export default class GetCourseQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async execute(
    getCourseQuery: GetCourseQuery,
  ): Promise<CourseResponse> {
    const course: Course = await this.courseRepository.findByIdOrThrow({
      ...getCourseQuery,
    });
    return strictPlainToClass(CourseResponse, course);
  }
}
