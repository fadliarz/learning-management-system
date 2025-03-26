import { Inject, Injectable } from '@nestjs/common';
import CourseScheduleRepository from '../../ports/output/repository/CourseScheduleRepository';
import CourseScheduleResponse from '../common/CourseScheduleResponse';
import GetCourseSchedulesQuery from './dto/GetCourseSchedulesQuery';
import CourseSchedule from '../../../domain-core/entity/CourseSchedule';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetCourseSchedulesQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_SCHEDULE_REPOSITORY)
    private readonly courseScheduleRepository: CourseScheduleRepository,
  ) {}

  public async execute(
    getSchedulesQuery: GetCourseSchedulesQuery,
  ): Promise<CourseScheduleResponse[]> {
    const courseSchedules: CourseSchedule[] =
      await this.courseScheduleRepository.findMany({
        ...getSchedulesQuery,
        pagination: strictPlainToClass(Pagination, getSchedulesQuery),
      });
    return courseSchedules.map((courseSchedule) =>
      strictPlainToClass(CourseScheduleResponse, courseSchedule),
    );
  }
}
