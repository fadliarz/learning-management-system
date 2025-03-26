import User from '../../../../../../user/domain/domain-core/entity/User';

export default class GetUserAssignmentQuery {
  public executor: User;
  public assignmentId: number;
}
