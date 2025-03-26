export default class AttachmentKey {
  public lessonId: number;
  public attachmentId: number;

  constructor(param: { lessonId: number; attachmentId: number }) {
    this.lessonId = param.lessonId;
    this.attachmentId = param.attachmentId;
  }
}
