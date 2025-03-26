import User from '../../../../../../user/domain/domain-core/entity/User';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default class GetUserAssignmentsQuery extends Pagination {
  public executor: User;
}
