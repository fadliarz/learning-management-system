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
import CategoryModule from '../category/CategoryModule';
import AddCourseCategoryCommandHandler from './domain/application-service/features/add-category/AddCourseCategoryCommandHandler';
import RemoveCourseCategoryCommandHandler from './domain/application-service/features/remove-category/RemoveCourseCategoryCommandHandler';
import CourseCacheMemoryImpl from './data-access/cache/adapter/CourseCacheMemoryImpl';
import CourseRedisCacheMemory from './data-access/cache/memory/CourseRedisCacheMemory';

@Module({
  imports: [ConfigModule, PrivilegeModule, CategoryModule],
  controllers: [CourseController],
  providers: [
    CreateCourseCommandHandler,
    AddCourseCategoryCommandHandler,
    RemoveCourseCategoryCommandHandler,
    GetCoursesQueryHandler,
    GetCourseQueryHandler,
    UpdateCourseCommandHandler,
    DeleteCourseCommandHandler,
    {
      provide: DependencyInjection.COURSE_REPOSITORY,
      useClass: CourseRepositoryImpl,
    },
    CourseDynamoDBRepository,
    {
      provide: DependencyInjection.COURSE_CACHE_MEMORY,
      useClass: CourseCacheMemoryImpl,
    },
    {
      provide: DependencyInjection.COURSE_REDIS_CACHE_MEMORY,
      useClass: CourseRedisCacheMemory,
    },
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
