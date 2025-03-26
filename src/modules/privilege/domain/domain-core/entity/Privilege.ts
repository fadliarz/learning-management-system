import { Permission } from './Permission';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import { Expose } from 'class-transformer';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';

export default class Privilege {
  private _userId: number;
  private _permission: Permission;
  private _createdAt: Date;

  public create() {
    this._createdAt = TimeFactory.generate();
  }

  @Expose()
  set userId(value: number) {
    if (this._userId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._userId = value;
  }

  @Expose()
  set permission(value: Permission) {
    if (this._permission !== undefined) {
      throw new ImmutableFieldException();
    }

    this._permission = value;
  }

  @Expose()
  @ISO8601ToDate()
  set createdAt(value: Date) {
    if (this._createdAt !== undefined) {
      throw new ImmutableFieldException();
    }

    this._createdAt = value;
  }

  get userId(): number {
    return this._userId;
  }

  get permission(): Permission {
    return this._permission;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
