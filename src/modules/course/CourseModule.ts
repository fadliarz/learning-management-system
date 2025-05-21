import { Module } from '@nestjs/common';
import CourseController from './application/rest/CourseController';
import CreateCourseCommandHandler from './domain/application-service/features/create-course/CreateCourseCommandHandler';
import GetCoursesQueryHandler from './domain/application-service/features/get-courses/GetCoursesQueryHandler';
import GetCourseQueryHandler from './domain/application-service/features/get-course/GetCourseQueryHandler';
import UpdateCourseCommandHandler from './domain/application-service/features/update-course/UpdateCourseCommandHandler';
import DeleteCourseCommandHandler from './domain/application-service/features/delete-course/DeleteCourseCommandHandler';
import ConfigModule from '../ConfigModule';
import CategoryModule from '../category/CategoryModule';
import AddCourseCategoryCommandHandler from './domain/application-service/features/add-category/AddCourseCategoryCommandHandler';
import RemoveCourseCategoryCommandHandler from './domain/application-service/features/remove-category/RemoveCourseCategoryCommandHandler';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, CategoryModule, DataAccessModule],
  controllers: [CourseController],
  providers: [
    CreateCourseCommandHandler,
    AddCourseCategoryCommandHandler,
    RemoveCourseCategoryCommandHandler,
    GetCoursesQueryHandler,
    GetCourseQueryHandler,
    UpdateCourseCommandHandler,
    DeleteCourseCommandHandler,
  ],
  exports: [],
})
export default class CourseModule {}
