import { Expose } from 'class-transformer';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';

export default class Lesson {
  private _lessonId: number;
  private _courseId: number;
  private _title: string;
  private _description: string;
  private _numberOfVideos: number;
  private _numberOfDurations: number;
  private _numberOfAttachments: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _version: number;
  private _videoArrangementVersion: number;

  public update(): void {
    this._updatedAt = TimeFactory.generate();
  }

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._lessonId = TimeFactory.dateToRandomMicroseconds(now);
    this._numberOfVideos = 0;
    this._numberOfDurations = 0;
    this._numberOfAttachments = 0;
    this._createdAt = now;
    this._version = 1;
    this._videoArrangementVersion = 1;
  }

  @Expose()
  set lessonId(value: number) {
    if (this._lessonId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._lessonId = value;
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
  set numberOfVideos(value: number) {
    if (this._numberOfVideos !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfVideos = value;
  }

  @Expose()
  set numberOfDurations(value: number) {
    if (this._numberOfDurations !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfDurations = value;
  }

  @Expose()
  set numberOfAttachments(value: number) {
    if (this._numberOfAttachments !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfAttachments = value;
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

  @Expose()
  set version(value: number) {
    if (this._version !== undefined) {
      throw new ImmutableFieldException();
    }

    this._version = value;
  }

  @Expose()
  set videoArrangementVersion(value: number) {
    if (this._videoArrangementVersion !== undefined) {
      throw new ImmutableFieldException();
    }

    this._videoArrangementVersion = value;
  }

  get lessonId(): number {
    return this._lessonId;
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

  get numberOfVideos(): number {
    return this._numberOfVideos;
  }

  get numberOfDurations(): number {
    return this._numberOfDurations;
  }

  get numberOfAttachments(): number {
    return this._numberOfAttachments;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get version(): number {
    return this._version;
  }

  get videoArrangementVersion(): number {
    return this._videoArrangementVersion;
  }
}
