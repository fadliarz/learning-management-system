import { AssignmentTaskType } from '../../../../../common/common-domain/AssignmentTaskType';
import { AssignmentType } from './AssignmentType';
import { Expose } from 'class-transformer';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';

export default class UserAssignment {
  private _assignmentId: number;
  private _userId: number;
  private _course: string;
  private _title: string;
  private _submission: string;
  private _deadline: Date;
  private _description: string;
  private _taskType: AssignmentTaskType;
  private _assignmentType: AssignmentType;
  private _createdAt: Date;
  private _classId: number;
  private _classAssignmentId: number;

  public create(): void {
    this._assignmentId = TimeFactory.dateToRandomMicroseconds(this._deadline);
    this._createdAt = TimeFactory.generate();
  }

  @Expose()
  set assignmentId(value: number) {
    if (this._assignmentId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._assignmentId = value;
  }

  @Expose()
  set userId(value: number) {
    if (this._userId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._userId = value;
  }

  @Expose()
  set course(value: string) {
    this._course = value;
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
  set assignmentType(value: AssignmentType) {
    if (this._assignmentType !== undefined) {
      throw new ImmutableFieldException();
    }

    this._assignmentType = value;
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
  set classId(value: number) {
    if (this._classId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._classId = value;
  }

  @Expose()
  set classAssignmentId(value: number) {
    if (this._classAssignmentId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._classAssignmentId = value;
  }

  get assignmentId(): number {
    return this._assignmentId;
  }

  get userId(): number {
    return this._userId;
  }

  get course(): string {
    return this._course;
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

  get assignmentType(): AssignmentType {
    return this._assignmentType;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get classId(): number {
    return this._classId;
  }

  get classAssignmentId(): number {
    return this._classAssignmentId;
  }
}
