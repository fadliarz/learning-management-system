import { Expose } from 'class-transformer';

export default class Pagination {
  @Expose()
  public lastEvaluatedId: number;

  @Expose()
  public limit: number;
}
