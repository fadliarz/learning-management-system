export default class CourseKey {
  public id: string;
  public courseId: number;

  constructor(param: { courseId: number }) {
    this.id = 'COURSE';
    this.courseId = param.courseId;
  }
}
