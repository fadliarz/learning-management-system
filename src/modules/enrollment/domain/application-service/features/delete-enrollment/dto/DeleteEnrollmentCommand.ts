import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteEnrollmentCommand {
  public executor: User;
  public courseId: number;
  public classId: number;
}
