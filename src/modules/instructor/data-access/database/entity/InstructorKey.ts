export default class InstructorKey {
  public userId: number;
  public classId: number;

  constructor(param: { userId: number; classId: number }) {
    this.userId = param.userId;
    this.classId = param.classId;
  }
}
