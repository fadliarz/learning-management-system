import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { Inject, Injectable } from '@nestjs/common';
import GetUpcomingUserAssignmentsQuery from './dto/GetUpcomingUserAssignmentsQuery';
import UserAssignmentResponse from '../common/UserAssignmentResponse';
import { UserAssignmentRepository } from '../../ports/output/repository/UserAssignmentRepository';
import UserAssignment from '../../../domain-core/entity/UserAssignment';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { AssignmentType } from '../../../domain-core/entity/AssignmentType';
import ClassAssignment from '../../../../../class-assignment/domain/domain-core/entity/ClassAssignment';
import Course from '../../../../../course/domain/domain-core/entity/Course';
import { ClassAssignmentRepository } from '../../../../../class-assignment/domain/application-service/ports/output/repository/ClassAssignmentRepository';
import { CourseRepository } from '../../../../../course/domain/application-service/ports/output/repository/CourseRepository';
import ClassAssignmentNotFoundException from '../../../../../class-assignment/domain/domain-core/exception/ClassAssignmentNotFoundException';
import TimeFactory from '../../../../../../common/common-domain/helper/TimeFactory';

@Injectable()
export default class GetUpcomingUserAssignmentsQueryHandler {
  constructor(
    @Inject(DependencyInjection.USER_ASSIGNMENT_REPOSITORY)
    private readonly userAssignmentRepository: UserAssignmentRepository,
    @Inject(DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY)
    private readonly classAssignmentRepository: ClassAssignmentRepository,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async execute(
    getTodayUserAssignmentsQuery: GetUpcomingUserAssignmentsQuery,
  ): Promise<UserAssignmentResponse[]> {
    const startAndEndOfTodayMillis = TimeFactory.getGMT7UpcomingMillis();
    const userAssignments: UserAssignment[] =
      await this.userAssignmentRepository.findMany({
        userId: getTodayUserAssignmentsQuery.executor.userId,
        pagination: strictPlainToClass(
          Pagination,
          getTodayUserAssignmentsQuery,
        ),
        rangeQuery: {
          id: {
            upper: startAndEndOfTodayMillis.end * 1000,
            lower: startAndEndOfTodayMillis.start * 1000,
          },
        },
      });
    const userAssignmentResponses: UserAssignmentResponse[] = [];
    for (const userAssignment of userAssignments) {
      try {
        if (userAssignment.assignmentType === AssignmentType.CLASS_ASSIGNMENT) {
          const userAssignmentResponse: UserAssignmentResponse =
            strictPlainToClass(UserAssignmentResponse, userAssignment);
          const classAssignment: ClassAssignment =
            await this.classAssignmentRepository.findByIdOrThrow({
              classId: userAssignment.classId,
              assignmentId: userAssignment.assignmentId,
            });
          const course: Course = await this.courseRepository.findByIdOrThrow({
            courseId: classAssignment.courseId,
          });
          userAssignmentResponse.course = course.title;
          userAssignmentResponse.title = classAssignment.title;
          userAssignmentResponse.submission = classAssignment.submission;
          userAssignmentResponse.deadline = classAssignment.deadline;
          userAssignmentResponse.description = classAssignment.description;
          userAssignmentResponse.taskType = classAssignment.taskType;
          userAssignmentResponse.createdAt = classAssignment.createdAt;
          userAssignmentResponses.push(userAssignmentResponse);
        }
        if (
          userAssignment.assignmentType === AssignmentType.PERSONAL_ASSIGNMENT
        ) {
          userAssignmentResponses.push(
            strictPlainToClass(UserAssignmentResponse, userAssignment),
          );
        }
      } catch (exception) {
        if (exception instanceof ClassAssignmentNotFoundException) {
          continue;
        }
        throw exception;
      }
    }
    return userAssignmentResponses;
  }
}
