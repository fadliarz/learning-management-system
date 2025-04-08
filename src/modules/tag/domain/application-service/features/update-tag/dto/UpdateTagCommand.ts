import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateTagCommand {
  public executor: User;
  public tagId: number;
  public title: string;
}
