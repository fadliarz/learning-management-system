import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateCategoryCommand {
  public executor: User;
  public title: string;
}
