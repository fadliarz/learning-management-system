import { Inject, Injectable } from '@nestjs/common';
import CourseScheduleRepository from '../../ports/output/repository/CourseScheduleRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import DeleteCourseScheduleCommand from './dto/DeleteCourseScheduleCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import CourseScheduleNotFoundException from '../../../domain-core/exception/CourseScheduleNotFoundException';

@Injectable()
export default class DeleteCourseScheduleCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_SCHEDULE_REPOSITORY)
    private readonly courseScheduleRepository: CourseScheduleRepository,
  ) {}

  public async execute(
    deleteCourseScheduleCommand: DeleteCourseScheduleCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      deleteCourseScheduleCommand.executor,
    );
    await this.courseScheduleRepository.deleteIfExistsOrThrow({
      ...deleteCourseScheduleCommand,
      domainException: new CourseScheduleNotFoundException(),
    });
  }
}
