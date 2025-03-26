import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateCategoryCommand {
  public executor: User;
  public categoryId: number;
  public title: string;
}
