import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteCourseScheduleCommand {
  public executor: User;
  public scheduleId: number;
  public courseId: number;
}
