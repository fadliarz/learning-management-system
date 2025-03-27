import User from '../../../../../../user/domain/domain-core/entity/User';

export default class SignOutCommand {
  public executor: User;
  public refreshToken: string;
}
