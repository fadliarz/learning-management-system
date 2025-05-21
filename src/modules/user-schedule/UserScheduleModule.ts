import { Module } from '@nestjs/common';
import UserScheduleController from './application/rest/UserScheduleController';
import GetUserSchedulesQueryHandler from './domain/application-service/features/get-schedules/GetUserSchedulesQueryHandler';
import GetUserScheduleQueryHandler from './domain/application-service/features/get-schedule/GetUserScheduleQueryHandler';
import ConfigModule from '../ConfigModule';
import GetUpcomingUserSchedulesQueryHandler from './domain/application-service/features/get-upcoming-schedules/GetUpcomingUserSchedulesQueryHandler';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [UserScheduleController],
  providers: [
    UserScheduleController,
    GetUserSchedulesQueryHandler,
    GetUpcomingUserSchedulesQueryHandler,
    GetUserScheduleQueryHandler,
  ],
  exports: [],
})
export default class UserScheduleModule {}
