export default class ClassAssignmentKey {
  public classId: number;
  public assignmentId: number;

  constructor(param: { classId: number; assignmentId: number }) {
    this.classId = param.classId;
    this.assignmentId = param.assignmentId;
  }
}
