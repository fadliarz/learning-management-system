import Pagination from '../../../../../../../common/common-domain/repository/Pagination';
import Notification from '../../../../domain-core/entity/Notification';

export interface NotificationRepository {
  findMany(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<Notification[]>;
}
