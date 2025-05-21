import { Module } from '@nestjs/common';
import LessonController from './application/rest/LessonController';
import CreateLessonCommandHandler from './domain/application-service/features/create-lesson/CreateLessonCommandHandler';
import GetLessonsQueryHandler from './domain/application-service/features/get-lessons/GetLessonsQueryHandler';
import GetLessonQueryHandler from './domain/application-service/features/get-lesson/GetLessonQueryHandler';
import UpdateLessonCommandHandler from './domain/application-service/features/update-lesson/UpdateLessonCommandHandler';
import UpdateLessonPositionCommandHandler from './domain/application-service/features/update-lesson-position/UpdateLessonPositionCommandHandler';
import DeleteLessonCommandHandler from './domain/application-service/features/delete-lesson/DeleteLessonCommandHandler';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import CourseModule from '../course/CourseModule';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PrivilegeModule,
    CourseModule,
    DataAccessModule,
  ],
  controllers: [LessonController],
  providers: [
    CreateLessonCommandHandler,
    GetLessonsQueryHandler,
    GetLessonQueryHandler,
    UpdateLessonCommandHandler,
    UpdateLessonPositionCommandHandler,
    DeleteLessonCommandHandler,
  ],
  exports: [],
})
export default class LessonModule {}
