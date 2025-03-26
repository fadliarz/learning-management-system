import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteUserAssignmentCommand {
  public executor: User;
  public assignmentId: number;
}
