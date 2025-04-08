export default class UniqueTagKey {
  public id: string;
  public tagId: number;

  constructor(param: { title: string }) {
    this.id = param.title;
    this.tagId = 1;
  }
}
