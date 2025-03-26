import { Expose } from 'class-transformer';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';

export default class AttachmentEntity {
  @Expose()
  public attachmentId: number;

  @Expose()
  public lessonId: number;

  @Expose()
  public courseId: number;

  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose()
  public file: string;

  @Expose()
  @ToISO()
  public createdAt: string;

  @Expose()
  @ToISO()
  public updatedAt: string;
}
