import { Expose } from 'class-transformer';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import ToArray from '../../../../../common/common-domain/decorator/ToArray';

export default class Scholarship {
  private _scholarshipId: number;
  private _image: string;
  private _title: string;
  private _description: string;
  private _provider: string;
  private _deadline: Date;
  private _reference: string;
  private _tags: number[];
  private _createdAt: Date;
  private _updatedAt: Date;

  public update(): void {
    this._updatedAt = TimeFactory.generate();
  }

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._scholarshipId = TimeFactory.dateToRandomMicroseconds(now);
    this._createdAt = now;
  }

  @Expose()
  set scholarshipId(value: number) {
    if (this._scholarshipId) {
      throw new ImmutableFieldException();
    }
    this._scholarshipId = value;
  }

  @Expose()
  set image(value: string) {
    this._image = value;
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
  set provider(value: string) {
    this._provider = value;
  }

  @Expose()
  @ISO8601ToDate()
  set deadline(value: Date) {
    this._deadline = value;
  }

  @Expose()
  set reference(value: string) {
    this._reference = value;
  }

  @Expose()
  @ToArray()
  set tags(value: number[]) {
    this._tags = value;
  }

  @Expose()
  @ISO8601ToDate()
  set createdAt(value: Date) {
    if (this._createdAt) {
      throw new ImmutableFieldException();
    }

    this._createdAt = value;
  }

  @Expose()
  @ISO8601ToDate()
  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  get scholarshipId(): number {
    return this._scholarshipId;
  }

  get image(): string {
    return this._image;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get provider(): string {
    return this._provider;
  }

  get deadline(): Date {
    return this._deadline;
  }

  get reference(): string {
    return this._reference;
  }

  get tags(): number[] {
    return this._tags;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
