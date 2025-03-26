import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateVideoCommand {
  public executor: User;
  public courseId: number;
  public lessonId: number;
  public title: string;
  public description: string;
  public durationInSec: number;
  public youtubeLink: string;
}
