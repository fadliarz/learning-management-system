import User from '../../../../../../user/domain/domain-core/entity/User';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default class GetInstructorsQuery extends Pagination {
  public executor: User;
  public courseId: number;
  public classId: number;
}
