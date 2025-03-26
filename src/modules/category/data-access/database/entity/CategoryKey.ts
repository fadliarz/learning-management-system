export default class CategoryKey {
  public id: string;
  public categoryId: number;

  constructor(param: { categoryId: number }) {
    this.id = 'CATEGORY';
    this.categoryId = param.categoryId;
  }
}
