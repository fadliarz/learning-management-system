import { Module } from '@nestjs/common';
import CourseScheduleController from './application/rest/CourseScheduleController';
import CreateCourseScheduleCommandHandler from './domain/application-service/features/create-schedule/CreateCourseScheduleCommandHandler';
import GetCourseSchedulesQueryHandler from './domain/application-service/features/get-schedules/GetCourseSchedulesQueryHandler';
import GetCourseScheduleQueryHandler from './domain/application-service/features/get-schedule/GetCourseScheduleQueryHandler';
import UpdateCourseScheduleCommandHandler from './domain/application-service/features/update-schedule/UpdateCourseScheduleCommandHandler';
import DeleteCourseScheduleCommandHandler from './domain/application-service/features/delete-schedule/DeleteCourseScheduleCommandHandler';
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
  controllers: [CourseScheduleController],
  providers: [
    CreateCourseScheduleCommandHandler,
    GetCourseSchedulesQueryHandler,
    GetCourseScheduleQueryHandler,
    UpdateCourseScheduleCommandHandler,
    DeleteCourseScheduleCommandHandler,
  ],
  exports: [],
})
export default class CourseScheduleModule {}
