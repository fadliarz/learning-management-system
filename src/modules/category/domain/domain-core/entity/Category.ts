import { Expose } from 'class-transformer';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';

export default class Category {
  private _categoryId: number;
  private _title: string;

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._categoryId = TimeFactory.dateToRandomMicroseconds(now);
  }

  @Expose()
  set categoryId(value: number) {
    if (this._categoryId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._categoryId = value;
  }

  @Expose()
  set title(value: string) {
    this._title = value;
  }

  get categoryId(): number {
    return this._categoryId;
  }

  get title(): string {
    return this._title;
  }
}
