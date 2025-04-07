import User from '../../../../../../user/domain/domain-core/entity/User';

export default class RemoveCourseCategoryCommand {
  public executor: User;
  public courseId: number;
  public categoryId: number;
}
