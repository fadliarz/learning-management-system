import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteClassAssignmentCommand {
  public executor: User;
  public assignmentId: number;
  public courseId: number;
  public classId: number;
}
