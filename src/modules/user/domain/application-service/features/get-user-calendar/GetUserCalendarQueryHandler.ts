import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import { CourseRepository } from '../../../../../course/domain/application-service/ports/output/repository/CourseRepository';
import GetUserCalendarQuery from './dto/GetUserCalendarQuery';
import { UserAssignmentRepository } from '../../../../../user-assignment/domain/application-service/ports/output/repository/UserAssignmentRepository';
import { UserScheduleRepository } from '../../../../../user-schedule/domain/application-service/ports/output/repository/UserScheduleRepository';
import UserCalendarResponse from '../common/UserCalendarResponse';
import UserAssignment from '../../../../../user-assignment/domain/domain-core/entity/UserAssignment';
import TimeFactory from '../../../../../../common/common-domain/helper/TimeFactory';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { AssignmentType } from '../../../../../user-assignment/domain/domain-core/entity/AssignmentType';
import ClassAssignment from '../../../../../class-assignment/domain/domain-core/entity/ClassAssignment';
import ClassAssignmentNotFoundException from '../../../../../class-assignment/domain/domain-core/exception/ClassAssignmentNotFoundException';
import { ClassAssignmentRepository } from '../../../../../class-assignment/domain/application-service/ports/output/repository/ClassAssignmentRepository';
import UserSchedule from '../../../../../user-schedule/domain/domain-core/entity/UserSchedule';
import { ScheduleType } from '../../../../../user-schedule/domain/domain-core/entity/ScheduleType';
import CourseSchedule from '../../../../../course-schedule/domain/domain-core/entity/CourseSchedule';
import CourseScheduleRepository from '../../../../../course-schedule/domain/application-service/ports/output/repository/CourseScheduleRepository';
import CourseScheduleNotFoundException from '../../../../../course-schedule/domain/domain-core/exception/CourseScheduleNotFoundException';

export default class GetUserCalendarQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.USER_ASSIGNMENT_REPOSITORY)
    private readonly userAssignmentRepository: UserAssignmentRepository,
    @Inject(DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY)
    private readonly classAssignmentRepository: ClassAssignmentRepository,
    @Inject(DependencyInjection.USER_SCHEDULE_REPOSITORY)
    private readonly userScheduleRepository: UserScheduleRepository,
    @Inject(DependencyInjection.COURSE_SCHEDULE_REPOSITORY)
    private readonly courseScheduleRepository: CourseScheduleRepository,
  ) {}

  public async execute(
    getUserCalendarQuery: GetUserCalendarQuery,
  ): Promise<UserCalendarResponse[]> {
    const userCalendarResponses: UserCalendarResponse[] = [];
    const startAndEndOfMonthMillis =
      TimeFactory.getGMT7StartAndEndOfMonthMillis(getUserCalendarQuery.month);
    await Promise.allSettled([
      this.pushFromUserAssignments({
        userCalendarResponses,
        userId: getUserCalendarQuery.executor.userId,
        id: {
          upper: startAndEndOfMonthMillis.end * 1000,
          lower: startAndEndOfMonthMillis.start * 1000,
        },
      }),
      await this.pushFromUserSchedules({
        userCalendarResponses,
        userId: getUserCalendarQuery.executor.userId,
        id: {
          upper: startAndEndOfMonthMillis.end * 1000,
          lower: startAndEndOfMonthMillis.start * 1000,
        },
      }),
    ]);
    return userCalendarResponses;
  }

  private async pushFromUserAssignments(param: {
    userCalendarResponses: UserCalendarResponse[];
    userId: number;
    id: {
      upper: number;
      lower: number;
    };
  }): Promise<void> {
    const { userCalendarResponses, userId, id } = param;
    const userAssignments: UserAssignment[] =
      await this.userAssignmentRepository.findMany({
        userId,
        pagination: new Pagination(),
        rangeQuery: {
          id,
        },
      });
    for (const userAssignment of userAssignments) {
      try {
        if (userAssignment.assignmentType === AssignmentType.CLASS_ASSIGNMENT) {
          const classAssignment: ClassAssignment =
            await this.classAssignmentRepository.findByIdOrThrow({
              classId: userAssignment.classId,
              assignmentId: userAssignment.assignmentId,
            });
          userCalendarResponses.push({
            title: classAssignment.title,
            date: this.getDate(classAssignment.deadline),
          });
        }
        if (
          userAssignment.assignmentType === AssignmentType.PERSONAL_ASSIGNMENT
        ) {
          userCalendarResponses.push({
            title: userAssignment.title,
            date: this.getDate(userAssignment.deadline),
          });
        }
      } catch (exception) {
        if (exception instanceof ClassAssignmentNotFoundException) {
          continue;
        }
        throw exception;
      }
    }
  }

  private async pushFromUserSchedules(param: {
    userCalendarResponses: UserCalendarResponse[];
    userId: number;
    id: {
      upper: number;
      lower: number;
    };
  }): Promise<void> {
    const { userCalendarResponses, userId, id } = param;
    const userSchedules: UserSchedule[] =
      await this.userScheduleRepository.findMany({
        userId,
        pagination: new Pagination(),
        rangeQuery: {
          id,
        },
      });
    for (const userSchedule of userSchedules) {
      try {
        if (userSchedule.scheduleType === ScheduleType.COURSE_SCHEDULE) {
          const courseSchedule: CourseSchedule =
            await this.courseScheduleRepository.findByIdOrThrow({
              courseId: userSchedule.courseId,
              scheduleId: userSchedule.courseScheduleId,
            });
          if (courseSchedule.startDate && courseSchedule.endDate) {
            userCalendarResponses.push({
              title: `(Start) ${courseSchedule.title}`,
              date: this.getDate(courseSchedule.startDate),
            });
            userCalendarResponses.push({
              title: `(End) ${courseSchedule.title}`,
              date: this.getDate(courseSchedule.endDate),
            });
          }
          if (courseSchedule.startDate || courseSchedule.endDate) {
            userCalendarResponses.push({
              title: courseSchedule.title,
              date: this.getDate(
                courseSchedule.startDate ?? courseSchedule.endDate,
              ),
            });
          }
        }
      } catch (exception) {
        if (exception instanceof CourseScheduleNotFoundException) {
          continue;
        }
        throw exception;
      }
    }
  }

  private getDate(theDate: Date | string): number {
    const date: Date = new Date(theDate);
    date.setUTCHours(date.getUTCHours() - 7);
    return date.getUTCDate();
  }
}
