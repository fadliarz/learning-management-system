import { Module } from '@nestjs/common';
import ConfigModule from '../ConfigModule';
import GetNotificationsQueryHandler from './domain/application-service/features/get-notifications/GetNotificationsQueryHandler';
import NotificationController from './application/rest/NotificationController';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [NotificationController],
  providers: [GetNotificationsQueryHandler],
  exports: [],
})
export default class NotificationModule {}
