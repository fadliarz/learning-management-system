import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import { Expose } from 'class-transformer';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';

export default class Instructor {
  private _userId: number;
  private _courseId: number;
  private _classId: number;
  private _createdAt: Date;

  public create(userId: number): void {
    this._userId = userId;
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
  set courseId(value: number) {
    if (this._courseId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._courseId = value;
  }

  @Expose()
  set classId(value: number) {
    if (this._classId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._classId = value;
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

  get courseId(): number {
    return this._courseId;
  }

  get classId(): number {
    return this._classId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
