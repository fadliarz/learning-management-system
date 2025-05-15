import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import { Expose } from 'class-transformer';

export default class Notification {
  private _notificationId: number;
  private _title: string;
  private _description: string;

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._notificationId = TimeFactory.dateToRandomMicroseconds(now);
  }

  @Expose()
  set notificationId(value: number) {
    if (this._notificationId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._notificationId = value;
  }

  @Expose()
  set title(value: string) {
    this._title = value;
  }

  @Expose()
  set description(value: string) {
    this._description = value;
  }

  get notificationId(): number {
    return this._notificationId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }
}
