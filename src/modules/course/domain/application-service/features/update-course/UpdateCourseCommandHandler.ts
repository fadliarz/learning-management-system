import UpdateCourseCommand from './dto/UpdateCourseCommand';
import Course from '../../../domain-core/entity/Course';
import { Inject, Injectable } from '@nestjs/common';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import CourseResponse from '../common/CourseResponse';
import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CourseCacheMemoryImpl from '../../../../data-access/cache/adapter/CourseCacheMemoryImpl';

@Injectable()
export default class UpdateCourseCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.COURSE_CACHE_MEMORY)
    private readonly courseCacheMemory: CourseCacheMemoryImpl,
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
    });
    const updatedCourse: Course | null = await this.courseRepository.findById({
      courseId: course.courseId,
    });
    if (updatedCourse) {
      await this.courseCacheMemory.setAndSaveIndex({
        key: course.courseId,
        value: updatedCourse,
      });
    }
    if (!updatedCourse) {
      await this.courseCacheMemory.deleteAndRemoveIndex(course.courseId);
    }
    return strictPlainToClass(CourseResponse, course);
  }
}
