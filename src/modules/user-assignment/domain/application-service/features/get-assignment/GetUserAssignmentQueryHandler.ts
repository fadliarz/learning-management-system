import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { Inject, Injectable } from '@nestjs/common';
import { UserAssignmentRepository } from '../../ports/output/repository/UserAssignmentRepository';
import UserAssignmentResponse from '../common/UserAssignmentResponse';
import GetUserAssignmentQuery from './dto/GetUserAssignmentQuery';
import UserAssignmentNotFoundException from '../../../domain-core/exception/UserAssignmentNotFoundException';
import UserAssignment from '../../../domain-core/entity/UserAssignment';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import { AssignmentType } from '../../../domain-core/entity/AssignmentType';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';
import { ClassAssignmentRepository } from '../../../../../class-assignment/domain/application-service/ports/output/repository/ClassAssignmentRepository';
import ClassAssignment from '../../../../../class-assignment/domain/domain-core/entity/ClassAssignment';
import { CourseRepository } from '../../../../../course/domain/application-service/ports/output/repository/CourseRepository';
import Course from '../../../../../course/domain/domain-core/entity/Course';

@Injectable()
export default class GetUserAssignmentQueryHandler {
  constructor(
    @Inject(DependencyInjection.USER_ASSIGNMENT_REPOSITORY)
    private readonly userAssignmentRepository: UserAssignmentRepository,
    @Inject(DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY)
    private readonly classAssignmentRepository: ClassAssignmentRepository,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async execute(
    getUserAssignmentQuery: GetUserAssignmentQuery,
  ): Promise<UserAssignmentResponse> {
    const userAssignment: UserAssignment =
      await this.userAssignmentRepository.findByIdOrThrow({
        userId: getUserAssignmentQuery.executor.userId,
        assignmentId: getUserAssignmentQuery.assignmentId,
        domainException: new UserAssignmentNotFoundException(),
      });
    if (userAssignment.assignmentType === AssignmentType.CLASS_ASSIGNMENT) {
      const userAssignmentResponse: UserAssignmentResponse = strictPlainToClass(
        UserAssignmentResponse,
        userAssignment,
      );
      const classAssignment: ClassAssignment =
        await this.classAssignmentRepository.findByIdOrThrow({
          classId: userAssignment.classId,
          assignmentId: userAssignment.classAssignmentId,
          domainException: new UserAssignmentNotFoundException(),
        });
      const course: Course = await this.courseRepository.findByIdOrThrow({
        courseId: classAssignment.courseId,
        domainException: new UserAssignmentNotFoundException(),
      });
      userAssignmentResponse.course = course.title;
      userAssignmentResponse.title = classAssignment.title;
      userAssignmentResponse.submission = classAssignment.submission;
      userAssignmentResponse.deadline = classAssignment.deadline;
      userAssignmentResponse.description = classAssignment.description;
      userAssignmentResponse.taskType = classAssignment.taskType;
      userAssignmentResponse.createdAt = classAssignment.createdAt;
      return userAssignmentResponse;
    }
    if (userAssignment.assignmentType === AssignmentType.PERSONAL_ASSIGNMENT) {
      return strictPlainToClass(UserAssignmentResponse, userAssignment);
    }
    throw new DomainException();
  }
}
