import User from '../../../../domain-core/entity/User';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default class GetUserEnrolledCoursesQuery extends Pagination {
  public executor: User;
}
