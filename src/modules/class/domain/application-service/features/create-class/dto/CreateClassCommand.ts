import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateClassCommand {
  public executor: User;
  public courseId: number;
  public title: string;
}
