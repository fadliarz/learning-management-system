import { Injectable } from '@nestjs/common';
import Pagination from '../../../../common/common-domain/repository/Pagination';
import Notification from '../domain-core/entity/Notification';

@Injectable()
export default class NotificationHelper {
  public static paginate(
    notifications: Notification[],
    pagination?: Pagination,
  ) {
    let filteredNotifications: Notification[] = notifications;
    if (pagination?.lastEvaluatedId) {
      filteredNotifications = filteredNotifications.filter(
        (notification) =>
          notification.notificationId < pagination.lastEvaluatedId,
      );
    }
    if (pagination?.limit) {
      filteredNotifications = filteredNotifications.slice(0, pagination.limit);
    }
    return filteredNotifications;
  }
}
