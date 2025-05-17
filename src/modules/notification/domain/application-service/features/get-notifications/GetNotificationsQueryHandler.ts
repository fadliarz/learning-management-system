import NotificationResponse from '../common/NotificationResponse';
import { Inject, Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../ports/output/repository/NotificationRepository';
import GetNotificationsQuery from './dto/GetNotificationsQuery';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Notification from '../../../domain-core/entity/Notification';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class GetNotificationsQueryHandler {
  constructor(
    @Inject(DependencyInjection.NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    getNotificationsQuery: GetNotificationsQuery,
  ): Promise<NotificationResponse[]> {
    const notifications: Notification[] =
      await this.notificationRepository.findMany({
        userId: getNotificationsQuery.executor.userId,
        pagination: strictPlainToClass(Pagination, getNotificationsQuery),
      });
    return notifications.map((notification) =>
      strictPlainToClass(NotificationResponse, notification),
    );
  }
}
