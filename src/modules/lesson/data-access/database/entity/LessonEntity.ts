import { Expose } from 'class-transformer';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';

export default class LessonEntity {
  @Expose()
  public lessonId: number;

  @Expose()
  public courseId: number;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public numberOfVideos: number;

  @Expose()
  public numberOfDurations: number;

  @Expose()
  public numberOfAttachments: number;

  @Expose()
  @ToISO()
  public createdAt: string;

  @Expose()
  @ToISO()
  public updatedAt: string;

  @Expose()
  public version: number;

  @Expose()
  public videoArrangementVersion: number;
}
