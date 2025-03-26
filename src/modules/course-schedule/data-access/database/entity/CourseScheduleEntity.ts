import { Expose } from 'class-transformer';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';

export default class CourseScheduleEntity {
  @Expose()
  public scheduleId: number;

  @Expose()
  public courseId: number;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public location: string;

  @Expose()
  @ToISO()
  public startDate: string;

  @Expose()
  @ToISO()
  public endDate: string;

  @Expose()
  @ToISO()
  public createdAt: string;

  @Expose()
  @ToISO()
  public updatedAt: string;
}
