import User from '../../../../../../user/domain/domain-core/entity/User';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default class GetUserSchedulesQuery extends Pagination {
  public executor: User;
}
