import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateAttachmentCommand {
  public executor: User;
  public courseId: number;
  public lessonId: number;
  public name: string;
  public description: string;
  public file: string;
}
