import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import NotificationRepositoryImpl from './data-access/database/adapter/NotificationRepositoryImpl';
import ConfigModule from '../ConfigModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import NotificationDynamoDBRepository from './data-access/database/repository/NotificationDynamoDBRepository';
import GetNotificationsQueryHandler from './domain/application-service/features/get-notifications/GetNotificationsQueryHandler';
import NotificationController from './application/rest/NotificationController';

@Module({
  imports: [ConfigModule, PrivilegeModule],
  controllers: [NotificationController],
  providers: [
    GetNotificationsQueryHandler,
    NotificationDynamoDBRepository,
    {
      provide: DependencyInjection.NOTIFICATION_REPOSITORY,
      useClass: NotificationRepositoryImpl,
    },
  ],
  exports: [],
})
export default class NotificationModule {}
