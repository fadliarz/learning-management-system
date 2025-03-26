import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import CourseScheduleController from './application/rest/CourseScheduleController';
import CreateCourseScheduleCommandHandler from './domain/application-service/features/create-schedule/CreateCourseScheduleCommandHandler';
import GetCourseSchedulesQueryHandler from './domain/application-service/features/get-schedules/GetCourseSchedulesQueryHandler';
import GetCourseScheduleQueryHandler from './domain/application-service/features/get-schedule/GetCourseScheduleQueryHandler';
import UpdateCourseScheduleCommandHandler from './domain/application-service/features/update-schedule/UpdateCourseScheduleCommandHandler';
import DeleteCourseScheduleCommandHandler from './domain/application-service/features/delete-schedule/DeleteCourseScheduleCommandHandler';
import CourseScheduleRepositoryImpl from './data-access/database/adapter/CourseScheduleRepositoryImpl';
import CourseScheduleDynamoDBRepository from './data-access/database/repository/CourseScheduleDynamoDBRepository';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import CourseModule from '../course/CourseModule';

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule, CourseModule],
  controllers: [CourseScheduleController],
  providers: [
    CreateCourseScheduleCommandHandler,
    GetCourseSchedulesQueryHandler,
    GetCourseScheduleQueryHandler,
    UpdateCourseScheduleCommandHandler,
    DeleteCourseScheduleCommandHandler,
    {
      provide: DependencyInjection.COURSE_SCHEDULE_REPOSITORY,
      useClass: CourseScheduleRepositoryImpl,
    },
    CourseScheduleDynamoDBRepository,
  ],
  exports: [
    {
      provide: DependencyInjection.COURSE_SCHEDULE_REPOSITORY,
      useClass: CourseScheduleRepositoryImpl,
    },
  ],
})
export default class CourseScheduleModule {}
