import UpdateCourseCommand from './dto/UpdateCourseCommand';
import Course from '../../../domain-core/entity/Course';
import { Inject, Injectable } from '@nestjs/common';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import CourseResponse from '../common/CourseResponse';
import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import CourseNotFoundException from '../../../domain-core/exception/CourseNotFoundException';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateCourseCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async execute(
    updateCourseCommand: UpdateCourseCommand,
  ): Promise<CourseResponse> {
    await this.authorizationService.authorizeManageCourse(
      updateCourseCommand.executor,
    );
    const course: Course = strictPlainToClass(Course, updateCourseCommand);
    course.update();
    await this.courseRepository.saveIfExistsOrThrow({
      course,
      domainException: new CourseNotFoundException(),
    });
    return strictPlainToClass(CourseResponse, course);
  }
}
