export default class UserAssignmentKey {
  public userId: number;
  public assignmentId: number;

  constructor(param: { userId: number; assignmentId: number }) {
    this.userId = param.userId;
    this.assignmentId = param.assignmentId;
  }
}
