import { Expose } from 'class-transformer';

export default class TagEntity {
  @Expose()
  public tagId: number;

  @Expose()
  public title: string;
}
