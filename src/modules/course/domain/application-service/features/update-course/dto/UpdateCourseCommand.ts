import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateCourseCommand {
  public executor: User;
  public courseId: number;
  public code: string;
  public image: string;
  public title: string;
  public description: string;
}
