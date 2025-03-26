import { Expose } from 'class-transformer';

export default class CategoryEntity {
  @Expose()
  public categoryId: number;

  @Expose()
  public title: string;
}
