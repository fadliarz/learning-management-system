export default class CourseScheduleKey {
  public courseId: number;
  public scheduleId: number;

  constructor(param: { courseId: number; scheduleId: number }) {
    this.courseId = param.courseId;
    this.scheduleId = param.scheduleId;
  }
}
