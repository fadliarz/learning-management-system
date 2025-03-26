export default class UniqueEmailKey {
  public id: string;
  public userId: number;
  public storedUserId: number;

  constructor(param: { email: string; userId: number }) {
    this.id = param.email;
    this.userId = 0;
    this.storedUserId = param.userId;
  }
}
