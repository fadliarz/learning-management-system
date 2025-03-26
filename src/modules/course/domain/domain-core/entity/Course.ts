import { Expose } from 'class-transformer';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import postgres from 'postgres';

export default class Course {
  private _courseId: number;
  private _code: string;
  private _image: string;
  private _title: string;
  private _description: string;
  private _numberOfStudents: number;
  private _numberOfInstructors: number;
  private _numberOfClasses: number;
  private _numberOfAssignments: number;
  private _numberOfLessons: number;
  private _numberOfVideos: number;
  private _numberOfDurations: number;
  private _numberOfAttachments: number;
  private _categories: string[];
  private _createdAt: Date;
  private _updatedAt: Date;
  private _lessonPositionVersion: number;
  private _lessonLastPosition: number;

  public update(): void {
    this._updatedAt = TimeFactory.generate();
  }

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._courseId = TimeFactory.dateToRandomMicroseconds(now);
    this._numberOfStudents = 0;
    this._numberOfInstructors = 0;
    this._numberOfClasses = 0;
    this._numberOfAssignments = 0;
    this._numberOfLessons = 0;
    this._numberOfVideos = 0;
    this._numberOfDurations = 0;
    this._numberOfAttachments = 0;
    this._categories = [];
    this._createdAt = now;
    this._lessonPositionVersion = 0;
    this._lessonLastPosition = 0;
  }

  @Expose()
  set courseId(value: number) {
    if (this._courseId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._courseId = value;
  }

  @Expose()
  set code(value: string) {
    this._code = value;
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
  set numberOfStudents(value: number) {
    if (this._numberOfStudents !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfStudents = value;
  }

  @Expose()
  set numberOfInstructors(value: number) {
    if (this._numberOfInstructors !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfInstructors = value;
  }

  @Expose()
  set numberOfClasses(value: number) {
    if (this._numberOfClasses !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfClasses = value;
  }

  @Expose()
  set numberOfAssignments(value: number) {
    if (this._numberOfAssignments !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfAssignments = value;
  }

  @Expose()
  set numberOfLessons(value: number) {
    if (this._numberOfLessons !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfLessons = value;
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
  set categories(value: string[]) {
    if (this._categories !== undefined) {
      throw new ImmutableFieldException();
    }

    this._categories = value;
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
  set lessonPositionVersion(value: number) {
    if (this._lessonPositionVersion !== undefined) {
      throw new ImmutableFieldException();
    }

    this._lessonPositionVersion = value;
  }

  @Expose()
  set lessonLastPosition(value: number) {
    if (this._lessonLastPosition !== undefined) {
      throw new ImmutableFieldException();
    }

    this._lessonLastPosition = value;
  }

  get courseId(): number {
    return this._courseId;
  }

  get code(): string {
    return this._code;
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

  get numberOfStudents(): number {
    return this._numberOfStudents;
  }

  get numberOfInstructors(): number {
    return this._numberOfInstructors;
  }

  get numberOfClasses(): number {
    return this._numberOfClasses;
  }

  get numberOfAssignments(): number {
    return this._numberOfAssignments;
  }

  get numberOfLessons(): number {
    return this._numberOfLessons;
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

  get categories(): string[] {
    return this._categories;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get lessonPositionVersion(): number {
    return this._lessonPositionVersion;
  }

  get lessonLastPosition(): number {
    return this._lessonLastPosition;
  }
}
