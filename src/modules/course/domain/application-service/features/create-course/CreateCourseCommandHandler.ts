import { Inject, Injectable } from '@nestjs/common';
import Course from '../../../domain-core/entity/Course';
import CourseResponse from '../common/CourseResponse';
import CreateCourseCommand from './dto/CreateCourseCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class CreateCourseCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async execute(
    createCourseCommand: CreateCourseCommand,
  ): Promise<CourseResponse> {
    await this.authorizationService.authorizeManageCourse(
      createCourseCommand.executor,
    );
    const course: Course = strictPlainToClass(Course, createCourseCommand);
    course.create();
    await this.courseRepository.saveIfNotExistsOrThrow({
      course,
    });
    return strictPlainToClass(CourseResponse, course);
  }
}
