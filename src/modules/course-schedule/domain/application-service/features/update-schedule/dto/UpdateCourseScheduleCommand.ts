import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateCourseScheduleCommand {
  public executor: User;
  public scheduleId: number;
  public courseId: number;
  public title: string;
  public description: string;
  public location: string;
  public startDate: Date;
  public endDate: Date;
}
