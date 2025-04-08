import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteTagCommand {
  public executor: User;
  public tagId: number;
}
