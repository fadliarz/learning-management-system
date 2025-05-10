import { Inject, Injectable } from '@nestjs/common';
import { EnrollmentRepository } from '../../ports/output/repository/EnrollmentRepository';
import GetUserEnrollmentsQuery from './dto/GetUserEnrollmentsQuery';
import EnrollmentResponse from '../common/EnrollmentResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Enrollment from '../../../domain-core/entity/Enrollment';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import { ClassRepository } from '../../../../../class/domain/application-service/ports/output/repository/ClassRepository';
import Class from '../../../../../class/domain/domain-core/entity/Class';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class GetUserEnrollmentsQueryHandler {
  constructor(
    @Inject(DependencyInjection.CLASS_REPOSITORY)
    private readonly classRepository: ClassRepository,
    @Inject(DependencyInjection.ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  public async execute(
    getUserEnrollmentsQuery: GetUserEnrollmentsQuery,
  ): Promise<EnrollmentResponse[]> {
    const classes: Class[] = await this.classRepository.findMany({
      courseId: getUserEnrollmentsQuery.courseId,
      pagination: new Pagination(),
    });
    const enrollments: Enrollment[] = [];
    for (const theClass of classes) {
      const enrollment: Enrollment | null =
        await this.enrollmentRepository.findById({
          userId: getUserEnrollmentsQuery.executor.userId,
          classId: theClass.classId,
        });
      if (enrollment) {
        enrollments.push(enrollment);
      }
    }
    return enrollments.map((enrollment) =>
      strictPlainToClass(EnrollmentResponse, enrollment),
    );
  }
}
