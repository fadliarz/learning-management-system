import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import CourseResponse from '../common/CourseResponse';
import GetCourseQuery from './dto/GetCourseQuery';
import Course from '../../../domain-core/entity/Course';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CourseCacheMemoryImpl from '../../../../data-access/cache/adapter/CourseCacheMemoryImpl';

export default class GetCourseQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_CACHE_MEMORY)
    private readonly courseCacheMemory: CourseCacheMemoryImpl,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async execute(
    getCourseQuery: GetCourseQuery,
  ): Promise<CourseResponse> {
    const cachedCourse: Course | null = await this.courseCacheMemory.get(
      getCourseQuery.courseId,
    );
    if (cachedCourse) return strictPlainToClass(CourseResponse, cachedCourse);
    const course: Course = await this.courseRepository.findByIdOrThrow({
      ...getCourseQuery,
    });
    await this.courseCacheMemory.setAndSaveIndex({
      key: getCourseQuery.courseId,
      value: course,
    });
    return strictPlainToClass(CourseResponse, course);
  }
}
