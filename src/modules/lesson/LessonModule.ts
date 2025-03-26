import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import LessonController from './application/rest/LessonController';
import CreateLessonCommandHandler from './domain/application-service/features/create-lesson/CreateLessonCommandHandler';
import GetLessonsQueryHandler from './domain/application-service/features/get-lessons/GetLessonsQueryHandler';
import GetLessonQueryHandler from './domain/application-service/features/get-lesson/GetLessonQueryHandler';
import UpdateLessonCommandHandler from './domain/application-service/features/update-lesson/UpdateLessonCommandHandler';
import UpdateLessonPositionCommandHandler from './domain/application-service/features/update-lesson-position/UpdateLessonPositionCommandHandler';
import DeleteLessonCommandHandler from './domain/application-service/features/delete-lesson/DeleteLessonCommandHandler';
import LessonRepositoryImpl from './data-access/database/adapter/LessonRepositoryImpl';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import LessonDynamoDBRepository from './data-access/database/repository/LessonDynamoDBRepository';
import CourseModule from '../course/CourseModule';

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule, CourseModule],
  controllers: [LessonController],
  providers: [
    CreateLessonCommandHandler,
    GetLessonsQueryHandler,
    GetLessonQueryHandler,
    UpdateLessonCommandHandler,
    UpdateLessonPositionCommandHandler,
    DeleteLessonCommandHandler,
    {
      provide: DependencyInjection.LESSON_REPOSITORY,
      useClass: LessonRepositoryImpl,
    },
    LessonDynamoDBRepository,
  ],
  exports: [LessonDynamoDBRepository],
})
export default class LessonModule {}
