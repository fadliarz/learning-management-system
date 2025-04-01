import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import CourseController from './application/rest/CourseController';
import CreateCourseCommandHandler from './domain/application-service/features/create-course/CreateCourseCommandHandler';
import GetCoursesQueryHandler from './domain/application-service/features/get-courses/GetCoursesQueryHandler';
import GetCourseQueryHandler from './domain/application-service/features/get-course/GetCourseQueryHandler';
import UpdateCourseCommandHandler from './domain/application-service/features/update-course/UpdateCourseCommandHandler';
import DeleteCourseCommandHandler from './domain/application-service/features/delete-course/DeleteCourseCommandHandler';
import CourseRepositoryImpl from './data-access/database/adapter/CourseRepositoryImpl';
import ConfigModule from '../ConfigModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import CourseDynamoDBRepository from './data-access/database/repository/CourseDynamoDBRepository';

@Module({
  imports: [ConfigModule, PrivilegeModule],
  controllers: [CourseController],
  providers: [
    CreateCourseCommandHandler,
    GetCoursesQueryHandler,
    GetCourseQueryHandler,
    UpdateCourseCommandHandler,
    DeleteCourseCommandHandler,
    {
      provide: DependencyInjection.COURSE_REPOSITORY,
      useClass: CourseRepositoryImpl,
    },
    CourseDynamoDBRepository,
  ],
  exports: [
    {
      provide: DependencyInjection.COURSE_REPOSITORY,
      useClass: CourseRepositoryImpl,
    },
    CourseDynamoDBRepository,
  ],
})
export default class CourseModule {}
