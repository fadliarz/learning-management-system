export default class UniqueEmailKey {
  public id: string;
  public userId: number;

  constructor(param: { email: string; userId: number }) {
    this.id = param.email;
    this.userId = param.userId;
  }
}
