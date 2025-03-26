import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteInstructorCommand {
  public executor: User;
  public courseId: number;
  public classId: number;
  public userId: number;
}
