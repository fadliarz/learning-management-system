export default class ClassKey {
  public courseId: number;
  public classId: number;

  constructor(param: { courseId: number; classId: number }) {
    this.courseId = param.courseId;
    this.classId = param.classId;
  }
}
