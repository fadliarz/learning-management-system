import GetUserManagedClassesQuery from './dto/GetUserManagedClassesQuery';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import InstructorRepository from '../../../../../instructor/domain/application-service/ports/output/InstructorRepository';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import Instructor from '../../../../../instructor/domain/domain-core/entity/Instructor';
import Course from '../../../../../course/domain/domain-core/entity/Course';
import CourseCacheMemoryImpl from '../../../../../course/data-access/cache/adapter/CourseCacheMemoryImpl';
import { CourseRepository } from '../../../../../course/domain/application-service/ports/output/repository/CourseRepository';
import Class from '../../../../../class/domain/domain-core/entity/Class';
import { ClassRepository } from '../../../../../class/domain/application-service/ports/output/repository/ClassRepository';
import UserManagedClassResponse from '../common/UserManagedClassResponse';

export default class GetUserManagedClassesQueryHandler {
  constructor(
    @Inject(DependencyInjection.INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: InstructorRepository,
    @Inject(DependencyInjection.COURSE_CACHE_MEMORY)
    private readonly courseCacheMemory: CourseCacheMemoryImpl,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.CLASS_REPOSITORY)
    private readonly classRepository: ClassRepository,
  ) {}

  public async execute(
    getUserManagedClassesQuery: GetUserManagedClassesQuery,
  ): Promise<UserManagedClassResponse[]> {
    const instructors: Instructor[] =
      await this.instructorRepository.findManyByUserId({
        userId: getUserManagedClassesQuery.executor.userId,
        pagination: new Pagination(),
      });
    const userManagedClassResponses: UserManagedClassResponse[] = [];
    for (const instructor of instructors) {
      const courseId: number = instructor.courseId;
      const classId: number = instructor.classId;
      const course: Course | null = await this.getCourse(courseId);
      if (!course) continue;
      const theClass: Class | null = await this.getClass(courseId, classId);
      if (!theClass) continue;
      userManagedClassResponses.push({
        courseId,
        classId,
        courseTitle: course.title,
        className: theClass.title,
      });
    }
    return userManagedClassResponses;
  }

  private async getCourse(courseId: number): Promise<Course | null> {
    const cachedCourse: Course | null =
      await this.courseCacheMemory.get(courseId);
    if (cachedCourse) return cachedCourse;
    const course: Course | null = await this.courseRepository.findById({
      courseId,
    });
    if (course) {
      await this.courseCacheMemory.setAndSaveIndex({
        key: courseId,
        value: course,
      });
    }
    return course;
  }

  private async getClass(
    courseId: number,
    classId: number,
  ): Promise<Class | null> {
    try {
      return await this.classRepository.findByIdOrThrow({
        courseId,
        classId,
      });
    } catch (exception) {
      return null;
    }
  }
}
