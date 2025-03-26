export default class UserKey {
  public id: string;
  public userId: number;

  constructor(param: { userId: number }) {
    this.id = 'USER';
    this.userId = param.userId;
  }
}
