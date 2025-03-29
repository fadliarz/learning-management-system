import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateCourseCommand {
  public executor: User;
  public code: string;
  public image: string;
  public title: string;
  public description: string;
}
