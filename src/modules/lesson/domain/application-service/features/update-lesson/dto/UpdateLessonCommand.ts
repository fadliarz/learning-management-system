import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateLessonCommand {
  public executor: User;
  public lessonId: number;
  public courseId: number;
  public title: string;
  public description: string;
}
