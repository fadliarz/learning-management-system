export default class CategoryLinkKey {
  public id: string;
  public categoryId: number;

  constructor(param: { categoryId: number; courseId: number }) {
    this.id = String(param.categoryId);
    this.categoryId = param.courseId;
  }
}
