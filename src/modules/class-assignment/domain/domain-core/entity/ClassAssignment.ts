import { AssignmentTaskType } from '../../../../../common/common-domain/AssignmentTaskType';
import { Expose } from 'class-transformer';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';

export default class ClassAssignment {
  private _assignmentId: number;
  private _courseId: number;
  private _classId: number;
  private _title: string;
  private _submission: string;
  private _deadline: Date;
  private _description: string;
  private _taskType: AssignmentTaskType;
  private _createdAt: Date;
  private _updatedAt: Date;

  public update(): void {
    this._updatedAt = TimeFactory.generate();
  }

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._assignmentId = TimeFactory.dateToRandomMicroseconds(this._deadline);
    this._createdAt = now;
  }

  @Expose()
  set assignmentId(value: number) {
    if (this._assignmentId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._assignmentId = value;
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
  set title(value: string) {
    this._title = value;
  }

  @Expose()
  set submission(value: string) {
    this._submission = value;
  }

  @Expose()
  @ISO8601ToDate()
  set deadline(value: Date) {
    this._deadline = value;
  }

  @Expose()
  set description(value: string) {
    this._description = value;
  }

  @Expose()
  set taskType(value: AssignmentTaskType) {
    this._taskType = value;
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

  get assignmentId(): number {
    return this._assignmentId;
  }

  get courseId(): number {
    return this._courseId;
  }

  get classId(): number {
    return this._classId;
  }

  get title(): string {
    return this._title;
  }

  get submission(): string {
    return this._submission;
  }

  get deadline(): Date {
    return this._deadline;
  }

  get description(): string {
    return this._description;
  }

  get taskType(): AssignmentTaskType {
    return this._taskType;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
