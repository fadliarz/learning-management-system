import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import GetUserEnrolledCoursesQuery from './dto/GetUserEnrolledCoursesQuery';
import CourseResponse from '../../../../../course/domain/application-service/features/common/CourseResponse';
import { CourseRepository } from '../../../../../course/domain/application-service/ports/output/repository/CourseRepository';
import { EnrollmentRepository } from '../../../../../enrollment/domain/application-service/ports/output/repository/EnrollmentRepository';
import Enrollment from '../../../../../enrollment/domain/domain-core/entity/Enrollment';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import Course from '../../../../../course/domain/domain-core/entity/Course';
import CourseNotFoundException from '../../../../../course/domain/domain-core/exception/CourseNotFoundException';

export default class GetUserEnrolledCoursesQueryHandler {
  constructor(
    @Inject(DependencyInjection.ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async execute(
    getUserEnrolledCoursesQuery: GetUserEnrolledCoursesQuery,
  ): Promise<CourseResponse[]> {
    const enrollments: Enrollment[] =
      await this.enrollmentRepository.findManyByUserId({
        userId: getUserEnrolledCoursesQuery.executor.userId,
        pagination: strictPlainToClass(Pagination, getUserEnrolledCoursesQuery),
      });
    const courseResponses: CourseResponse[] = [];
    for (const enrollment of enrollments) {
      try {
        const course: Course = await this.courseRepository.findByIdOrThrow({
          courseId: enrollment.courseId,
        });
        courseResponses.push(strictPlainToClass(CourseResponse, course));
      } catch (exception) {
        if (exception instanceof CourseNotFoundException) continue;
        throw exception;
      }
    }
    return courseResponses;
  }
}
