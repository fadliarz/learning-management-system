import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateVideoCommand {
  public executor: User;
  public videoId: number;
  public courseId: number;
  public lessonId: number;
  public title: string;
  public description: string;
  public youtubeLink: string;
  public durationInSec: number;
}
