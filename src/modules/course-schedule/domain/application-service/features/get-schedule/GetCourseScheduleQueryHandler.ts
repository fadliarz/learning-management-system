import { Inject, Injectable } from '@nestjs/common';
import CourseScheduleRepository from '../../ports/output/repository/CourseScheduleRepository';
import GetCourseScheduleQuery from './dto/GetCourseScheduleQuery';
import CourseScheduleResponse from '../common/CourseScheduleResponse';
import CourseSchedule from '../../../domain-core/entity/CourseSchedule';
import CourseScheduleNotFoundException from '../../../domain-core/exception/CourseScheduleNotFoundException';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetCourseScheduleQueryHandler {
  constructor(
    @Inject(DependencyInjection.COURSE_SCHEDULE_REPOSITORY)
    private readonly courseScheduleRepository: CourseScheduleRepository,
  ) {}

  public async execute(
    getCourseScheduleQuery: GetCourseScheduleQuery,
  ): Promise<CourseScheduleResponse> {
    const courseSchedule: CourseSchedule =
      await this.courseScheduleRepository.findByIdOrThrow({
        ...getCourseScheduleQuery,
        domainException: new CourseScheduleNotFoundException(),
      });
    return strictPlainToClass(CourseScheduleResponse, courseSchedule);
  }
}
