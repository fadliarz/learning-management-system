import { Inject, Injectable } from '@nestjs/common';
import { UserScheduleRepository } from '../../ports/output/repository/UserScheduleRepository';
import GetUserSchedulesQuery from './dto/GetUserSchedulesQuery';
import UserScheduleResponse from '../common/UserScheduleResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import UserSchedule from '../../../domain-core/entity/UserSchedule';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CourseScheduleRepository from '../../../../../course-schedule/domain/application-service/ports/output/repository/CourseScheduleRepository';
import { ScheduleType } from '../../../domain-core/entity/ScheduleType';
import CourseSchedule from '../../../../../course-schedule/domain/domain-core/entity/CourseSchedule';
import UserScheduleNotFoundException from '../../../domain-core/exception/UserScheduleNotFoundException';

@Injectable()
export default class GetUserSchedulesQueryHandler {
  constructor(
    @Inject(DependencyInjection.USER_SCHEDULE_REPOSITORY)
    private readonly userScheduleRepository: UserScheduleRepository,
    @Inject(DependencyInjection.COURSE_SCHEDULE_REPOSITORY)
    private readonly courseScheduleRepository: CourseScheduleRepository,
  ) {}

  public async execute(
    getUserSchedulesQuery: GetUserSchedulesQuery,
  ): Promise<UserScheduleResponse[]> {
    const userSchedules: UserSchedule[] =
      await this.userScheduleRepository.findMany({
        userId: getUserSchedulesQuery.executor.userId,
        pagination: strictPlainToClass(Pagination, getUserSchedulesQuery),
      });
    const userScheduleResponses: UserScheduleResponse[] = [];
    for (const userSchedule of userSchedules) {
      try {
        if (userSchedule.scheduleType === ScheduleType.COURSE_SCHEDULE) {
          const userScheduleResponse: UserScheduleResponse = strictPlainToClass(
            UserScheduleResponse,
            userSchedule,
          );
          const courseSchedule: CourseSchedule =
            await this.courseScheduleRepository.findByIdOrThrow({
              courseId: userSchedule.courseId,
              scheduleId: userSchedule.courseScheduleId,
            });
          userScheduleResponse.title = courseSchedule.title;
          userScheduleResponse.description = courseSchedule.description;
          userScheduleResponse.location = courseSchedule.location;
          userScheduleResponse.startDate = courseSchedule.startDate;
          userScheduleResponse.endDate = courseSchedule.endDate;
          userScheduleResponses.push(userScheduleResponse);
        }
      } catch (exception) {
        if (exception instanceof UserScheduleNotFoundException) {
          continue;
        }
        throw exception;
      }
    }
    return userScheduleResponses;
  }
}
