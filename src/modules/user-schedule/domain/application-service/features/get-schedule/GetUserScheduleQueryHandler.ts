import { Inject, Injectable } from '@nestjs/common';
import { UserScheduleRepository } from '../../ports/output/repository/UserScheduleRepository';
import GetUserScheduleQuery from './dto/GetUserScheduleQuery';
import UserScheduleResponse from '../common/UserScheduleResponse';
import UserScheduleNotFoundException from '../../../domain-core/exception/UserScheduleNotFoundException';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import UserSchedule from '../../../domain-core/entity/UserSchedule';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CourseScheduleRepository from '../../../../../course-schedule/domain/application-service/ports/output/repository/CourseScheduleRepository';
import { ScheduleType } from '../../../domain-core/entity/ScheduleType';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';
import CourseSchedule from '../../../../../course-schedule/domain/domain-core/entity/CourseSchedule';

@Injectable()
export default class GetUserScheduleQueryHandler {
  constructor(
    @Inject(DependencyInjection.USER_SCHEDULE_REPOSITORY)
    private readonly userScheduleRepository: UserScheduleRepository,
    @Inject(DependencyInjection.COURSE_SCHEDULE_REPOSITORY)
    private readonly courseScheduleRepository: CourseScheduleRepository,
  ) {}

  public async execute(
    getUserScheduleQuery: GetUserScheduleQuery,
  ): Promise<UserScheduleResponse> {
    const userSchedule: UserSchedule =
      await this.userScheduleRepository.findByIdOrThrow({
        userId: getUserScheduleQuery.executor.userId,
        scheduleId: getUserScheduleQuery.scheduleId,
        domainException: new UserScheduleNotFoundException(),
      });

    if (userSchedule.scheduleType === ScheduleType.COURSE_SCHEDULE) {
      const userScheduleResponse: UserScheduleResponse = strictPlainToClass(
        UserScheduleResponse,
        userSchedule,
      );
      const courseSchedule: CourseSchedule =
        await this.courseScheduleRepository.findByIdOrThrow({
          courseId: userSchedule.courseId,
          scheduleId: userSchedule.courseScheduleId,
          domainException: new UserScheduleNotFoundException(),
        });
      userScheduleResponse.title = courseSchedule.title;
      userScheduleResponse.description = courseSchedule.description;
      userScheduleResponse.location = courseSchedule.location;
      userScheduleResponse.startDate = courseSchedule.startDate;
      userScheduleResponse.endDate = courseSchedule.endDate;
      return userScheduleResponse;
    } else {
      throw new DomainException();
    }
  }
}
