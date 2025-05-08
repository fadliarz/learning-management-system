import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteClassCommand {
  public executor: User;
  public classId: number;
  public courseId: number;
}
