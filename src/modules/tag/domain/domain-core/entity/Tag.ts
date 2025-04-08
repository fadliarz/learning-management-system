import { Expose } from 'class-transformer';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';

export default class Tag {
  private _tagId: number;
  private _title: string;

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._tagId = TimeFactory.dateToRandomMicroseconds(now);
  }

  @Expose()
  set tagId(value: number) {
    if (this._tagId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._tagId = value;
  }

  @Expose()
  set title(value: string) {
    this._title = value;
  }

  get tagId(): number {
    return this._tagId;
  }

  get title(): string {
    return this._title;
  }
}
