import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import { Expose } from 'class-transformer';

export default class Notification {
  private _userId: number;
  private _notificationId: number;
  private _title: string;
  private _description: string;

  @Expose()
  set userId(value: number) {
    if (this._userId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._userId = value;
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

  get userId(): number {
    return this._userId;
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
