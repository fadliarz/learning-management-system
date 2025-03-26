import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateClassCommand {
  public executor: User;
  public classId: number;
  public courseId: number;
  public title: string;
}
