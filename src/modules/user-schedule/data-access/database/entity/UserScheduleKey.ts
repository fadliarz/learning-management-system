export default class CourseScheduleKey {
  public userId: number;
  public scheduleId: number;

  constructor(param: { userId: number; scheduleId: number }) {
    this.userId = param.userId;
    this.scheduleId = param.scheduleId;
  }
}
