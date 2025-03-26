import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteAttachmentCommand {
  public executor: User;
  public attachmentId: number;
  public courseId: number;
  public lessonId: number;
}
