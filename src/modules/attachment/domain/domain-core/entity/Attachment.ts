import { Expose } from 'class-transformer';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';

export default class Attachment {
  private _attachmentId: number;
  private _courseId: number;
  private _lessonId: number;
  private _name: string;
  private _description: string;
  private _file: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  public update(): void {
    this._updatedAt = TimeFactory.generate();
  }

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._attachmentId = TimeFactory.dateToRandomMicroseconds(now);
    this._createdAt = now;
  }

  @Expose()
  set attachmentId(value: number) {
    if (this._attachmentId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._attachmentId = value;
  }

  @Expose()
  set courseId(value: number) {
    if (this._courseId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._courseId = value;
  }

  @Expose()
  set lessonId(value: number) {
    if (this._lessonId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._lessonId = value;
  }

  @Expose()
  set name(value: string) {
    this._name = value;
  }

  @Expose()
  set description(value: string) {
    this._description = value;
  }

  @Expose()
  set file(value: string) {
    this._file = value;
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

  get attachmentId(): number {
    return this._attachmentId;
  }

  get courseId(): number {
    return this._courseId;
  }

  get lessonId(): number {
    return this._lessonId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get file(): string {
    return this._file;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
