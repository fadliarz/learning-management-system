import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteLessonCommand {
  public executor: User;
  public lessonId: number;
  public courseId: number;
}
