import Pagination from '../../../../../../../common/common-domain/repository/Pagination';
import User from '../../../../../../user/domain/domain-core/entity/User';

export default class GetNotificationsQuery extends Pagination {
  public executor: User;
}
