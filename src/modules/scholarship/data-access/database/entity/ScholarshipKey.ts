export default class ScholarshipKey {
  public id: string;
  public scholarshipId: number;

  constructor(param: { scholarshipId: number }) {
    this.id = 'SCHOLARSHIP';
    this.scholarshipId = param.scholarshipId;
  }
}
