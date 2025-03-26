import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteVideoCommand {
  public executor: User;
  public videoId: number;
  public courseId: number;
  public lessonId: number;
}
