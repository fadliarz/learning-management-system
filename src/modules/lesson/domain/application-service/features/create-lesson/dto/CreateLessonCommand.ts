import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateLessonCommand {
  public executor: User;
  public courseId: number;
  public title: string;
  public description: string;
}
