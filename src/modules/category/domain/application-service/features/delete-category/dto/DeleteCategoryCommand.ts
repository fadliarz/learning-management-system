import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteCategoryCommand {
  public executor: User;
  public categoryId: number;
}
