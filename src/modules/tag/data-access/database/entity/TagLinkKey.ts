export default class TagLinkKey {
  public id: string;
  public tagId: number;

  constructor(param: { tagId: number; scholarshipId: number }) {
    this.id = String(param.tagId);
    this.tagId = param.scholarshipId;
  }
}
