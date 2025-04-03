import ToISO from '../../../../../common/common-domain/decorator/ToISO';
import { Expose } from 'class-transformer';

export default class VideoEntity {
  @Expose()
  public videoId: number;

  @Expose()
  public courseId: number;

  @Expose()
  public lessonId: number;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public durationInSec: number;

  @Expose()
  public youtubeLink: string;

  @Expose()
  @ToISO()
  public createdAt: string;

  @Expose()
  @ToISO()
  public updatedAt: string;
}
