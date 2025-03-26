import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateVideoPositionCommand {
  public executor: User;
  public courseId: number;
  public lessonId: number;
  public videoId: number;
  public version: number;
  public upperVideoId: number;
  public upperVideoPosition: number;
  public lowerVideoId: number;
  public lowerVideoPosition: number;
}
