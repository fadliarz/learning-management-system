import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateTagCommand {
  public executor: User;
  public title: string;
}
