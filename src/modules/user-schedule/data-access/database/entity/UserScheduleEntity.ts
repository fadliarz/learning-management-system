import { Expose } from 'class-transformer';
import { ScheduleType } from '../../../domain/domain-core/entity/ScheduleType';

export default class UserScheduleEntity {
  @Expose()
  public userId: number;

  @Expose()
  public scheduleId: number;

  @Expose()
  public scheduleType: ScheduleType;

  @Expose()
  public courseId: number;

  @Expose()
  public courseScheduleId: number;
}
