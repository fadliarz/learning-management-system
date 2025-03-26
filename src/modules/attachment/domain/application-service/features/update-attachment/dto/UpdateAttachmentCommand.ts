import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateAttachmentCommand {
  public executor: User;
  public attachmentId: number;
  public lessonId: number;
  public name: string;
  public description: string;
}
