import { Expose } from 'class-transformer';

import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';

export default class Video {
  private _videoId: number;
  private _courseId: number;
  private _lessonId: number;
  private _title: string;
  private _description: string;
  private _durationInSec: number;
  private _youtubeLink: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  public update(): void {
    this._updatedAt = TimeFactory.generate();
  }

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._videoId = TimeFactory.dateToRandomMicroseconds(now);
    this._createdAt = now;
  }

  @Expose()
  set videoId(value: number) {
    if (this._videoId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._videoId = value;
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
  set title(value: string) {
    this._title = value;
  }

  @Expose()
  set description(value: string) {
    this._description = value;
  }

  @Expose()
  set durationInSec(value: number) {
    this._durationInSec = value;
  }

  @Expose()
  set youtubeLink(value: string) {
    this._youtubeLink = value;
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

  get videoId(): number {
    return this._videoId;
  }

  get courseId(): number {
    return this._courseId;
  }

  get lessonId(): number {
    return this._lessonId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get durationInSec(): number {
    return this._durationInSec;
  }

  get youtubeLink(): string {
    return this._youtubeLink;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
