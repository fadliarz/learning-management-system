export default class LessonKey {
  public courseId: number;
  public lessonId: number;

  constructor(param: { courseId: number; lessonId: number }) {
    this.courseId = param.courseId;
    this.lessonId = param.lessonId;
  }
}
