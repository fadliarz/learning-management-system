import User from '../../../../../../user/domain/domain-core/entity/User';

export default class GetUserEnrollmentsQuery {
  public executor: User;
  public courseId: number;
}
