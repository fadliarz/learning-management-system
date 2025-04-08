export default class TagKey {
  public id: string;
  public tagId: number;

  constructor(param: { tagId: number }) {
    this.id = 'TAG';
    this.tagId = param.tagId;
  }
}
