import { Expose } from 'class-transformer';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';

export default class CourseSchedule {
  private _scheduleId: number;
  private _courseId: number;
  private _title: string;
  private _description: string;
  private _location: string;
  private _startDate: Date;
  private _endDate: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  public update(): void {
    this._updatedAt = TimeFactory.generate();
  }

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._scheduleId = TimeFactory.dateToRandomMicroseconds(now);
    this._createdAt = now;
  }

  @Expose()
  set scheduleId(value: number) {
    if (this._scheduleId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._scheduleId = value;
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
  set description(value: string) {
    this._description = value;
  }

  @Expose()
  set location(value: string) {
    this._location = value;
  }

  @Expose()
  @ISO8601ToDate()
  set startDate(value: Date) {
    this._startDate = value;
  }

  @Expose()
  @ISO8601ToDate()
  set endDate(value: Date) {
    this._endDate = value;
  }

  @Expose()
  @ISO8601ToDate()
  set createdAt(value: Date) {
    if (this._createdAt !== undefined) {
      throw new ImmutableFieldException();
    }

    this._createdAt = value;
  }

  @Expose()
  @ISO8601ToDate()
  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  get scheduleId(): number {
    return this._scheduleId;
  }

  get courseId(): number {
    return this._courseId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get location(): string {
    return this._location;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
