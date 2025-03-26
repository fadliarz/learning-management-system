export default class UniqueCategoryKey {
  public id: string;
  public categoryId: number;

  constructor(param: { title: string }) {
    this.id = param.title;
    this.categoryId = 1;
  }
}
