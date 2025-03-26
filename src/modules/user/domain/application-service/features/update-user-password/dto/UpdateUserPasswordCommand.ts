import User from '../../../../domain-core/entity/User';

export default class UpdateUserPasswordCommand {
  public executor: User;
  public password: string;
}
