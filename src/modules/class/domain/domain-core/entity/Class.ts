import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import { Expose } from 'class-transformer';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';

export default class Class {
  private _classId: number;
  private _courseId: number;
  private _title: string;
  private _numberOfInstructors: number;
  private _numberOfAssignments: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  public update(): void {
    this._updatedAt = TimeFactory.generate();
  }

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._classId = TimeFactory.dateToRandomMicroseconds(now);
    this._numberOfInstructors = 0;
    this._numberOfAssignments = 0;
    this.createdAt = now;
  }

  @Expose()
  set classId(value: number) {
    if (this._classId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._classId = value;
  }

  @Expose()
  set courseId(value: number) {
    if (this._courseId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._courseId = value;
  }

  @Expose()
  set title(value: string) {
    this._title = value;
  }

  @Expose()
  set numberOfInstructors(value: number) {
    if (this.numberOfInstructors !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfInstructors = value;
  }

  @Expose()
  set numberOfAssignments(value: number) {
    if (this.numberOfAssignments !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfAssignments = value;
  }

  @Expose()
  @ISO8601ToDate()
  set createdAt(value: Date) {
    if (this.createdAt !== undefined) {
      throw new ImmutableFieldException();
    }

    this._createdAt = value;
  }

  @Expose()
  @ISO8601ToDate()
  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  get classId(): number {
    return this._classId;
  }

  get courseId(): number {
    return this._courseId;
  }

  get title(): string {
    return this._title;
  }

  get numberOfInstructors(): number {
    return this._numberOfInstructors;
  }

  get numberOfAssignments(): number {
    return this._numberOfAssignments;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
