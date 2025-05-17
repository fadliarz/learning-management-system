import { Expose } from 'class-transformer';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';

export default class PushObject {
  private _deviceId: string;
  private _userId: number;
  private _pushObjectString: string;

  @Expose()
  set deviceId(value: string) {
    if (this._deviceId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._deviceId = value;
  }

  @Expose()
  set userId(value: number) {
    if (this._userId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._userId = value;
  }

  @Expose()
  set pushObjectString(value: string) {
    this._pushObjectString = value;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get userId(): number {
    return this._userId;
  }

  get pushObjectString(): string {
    return this._pushObjectString;
  }
}
