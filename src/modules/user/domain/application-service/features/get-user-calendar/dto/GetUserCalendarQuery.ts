import User from '../../../../domain-core/entity/User';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default class GetUserCalendarQuery extends Pagination {
  public executor: User;
  public month: number;
}
