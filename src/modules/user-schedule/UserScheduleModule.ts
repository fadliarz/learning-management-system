import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import UserScheduleController from './application/rest/UserScheduleController';
import UserScheduleRepositoryImpl from './data-access/database/adapter/UserScheduleRepositoryImpl';
import GetUserSchedulesQueryHandler from './domain/application-service/features/get-schedules/GetUserSchedulesQueryHandler';
import GetUserScheduleQueryHandler from './domain/application-service/features/get-schedule/GetUserScheduleQueryHandler';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import UserScheduleDynamoDBRepository from './data-access/database/repository/UserScheduleDynamoDBRepository';
import CourseScheduleModule from '../course-schedule/CourseScheduleModule';
import GetUpcomingUserSchedulesQueryHandler from './domain/application-service/features/get-upcoming-schedules/GetUpcomingUserSchedulesQueryHandler';

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule, CourseScheduleModule],
  controllers: [UserScheduleController],
  providers: [
    UserScheduleController,
    GetUserSchedulesQueryHandler,
    GetUpcomingUserSchedulesQueryHandler,
    GetUserScheduleQueryHandler,
    {
      provide: DependencyInjection.USER_SCHEDULE_REPOSITORY,
      useClass: UserScheduleRepositoryImpl,
    },
    UserScheduleDynamoDBRepository,
  ],
  exports: [],
})
export default class UserScheduleModule {}
