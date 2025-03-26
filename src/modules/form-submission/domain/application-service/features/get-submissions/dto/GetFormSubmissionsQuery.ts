import Pagination from '../../../../../../../common/common-domain/repository/Pagination';
import User from '../../../../../../user/domain/domain-core/entity/User';

export default class GetFormSubmissionsQuery extends Pagination {
  public executor: User;
  public formId: string;
}
