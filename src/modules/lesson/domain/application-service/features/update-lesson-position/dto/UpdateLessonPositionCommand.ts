import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateLessonPositionCommand {
  public executor: User;
  public lessonId: number;
  public courseId: number;
  public version: number;
  public upperLessonId?: number;
  public upperLessonPosition?: number;
  public lowerLessonId?: number;
  public lowerLessonPosition?: number;
}
