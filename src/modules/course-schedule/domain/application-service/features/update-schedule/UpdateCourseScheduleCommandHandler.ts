import { Inject, Injectable } from '@nestjs/common';
import CourseScheduleRepository from '../../ports/output/repository/CourseScheduleRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import UpdateCourseScheduleCommand from './dto/UpdateCourseScheduleCommand';
import CourseScheduleResponse from '../common/CourseScheduleResponse';
import CourseSchedule from '../../../domain-core/entity/CourseSchedule';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';

@Injectable()
export default class UpdateCourseScheduleCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_SCHEDULE_REPOSITORY)
    private readonly courseScheduleRepository: CourseScheduleRepository,
  ) {}

  public async execute(
    updateCourseScheduleCommand: UpdateCourseScheduleCommand,
  ): Promise<CourseScheduleResponse> {
    await this.authorizationService.authorizeManageCourse(
      updateCourseScheduleCommand.executor,
    );
    const courseSchedule: CourseSchedule = strictPlainToClass(
      CourseSchedule,
      updateCourseScheduleCommand,
    );
    courseSchedule.update();
    await this.courseScheduleRepository.saveIfExistsOrThrow({
      courseSchedule,
    });
    return strictPlainToClass(CourseScheduleResponse, courseSchedule);
  }
}
