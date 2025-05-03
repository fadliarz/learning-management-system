import { Inject, Injectable } from '@nestjs/common';
import CourseScheduleRepository from '../../ports/output/repository/CourseScheduleRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CreateCourseScheduleCommand from './dto/CreateCourseScheduleCommand';
import CourseScheduleResponse from '../common/CourseScheduleResponse';
import CourseSchedule from '../../../domain-core/entity/CourseSchedule';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';
import { CourseRepository } from '../../../../../course/domain/application-service/ports/output/repository/CourseRepository';

@Injectable()
export default class CreateCourseScheduleCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.COURSE_SCHEDULE_REPOSITORY)
    private readonly courseScheduleRepository: CourseScheduleRepository,
  ) {}

  public async execute(
    createCourseScheduleCommand: CreateCourseScheduleCommand,
  ): Promise<CourseScheduleResponse> {
    await this.authorizationService.authorizeManageCourse(
      createCourseScheduleCommand.executor,
    );
    await this.courseRepository.findByIdOrThrow({
      courseId: createCourseScheduleCommand.courseId,
    });
    const courseSchedule: CourseSchedule = strictPlainToClass(
      CourseSchedule,
      createCourseScheduleCommand,
    );
    courseSchedule.create();
    await this.courseScheduleRepository.saveIfNotExistsOrThrow({
      courseSchedule,
      domainException: new DomainException(),
    });
    return strictPlainToClass(CourseScheduleResponse, courseSchedule);
  }
}
