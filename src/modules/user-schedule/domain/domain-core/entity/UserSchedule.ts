import { Expose } from 'class-transformer';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import { ScheduleType } from './ScheduleType';

export default class UserSchedule {
  private _userId: number;
  private _scheduleId: number;
  private _scheduleType: ScheduleType;
  private _courseId: number;
  private _courseScheduleId: number;

  @Expose()
  set userId(value: number) {
    if (this._userId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._userId = value;
  }

  @Expose()
  set scheduleId(value: number) {
    if (this._scheduleId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._scheduleId = value;
  }

  @Expose()
  set scheduleType(value: ScheduleType) {
    if (this._scheduleType !== undefined) {
      throw new ImmutableFieldException();
    }

    this._scheduleType = value;
  }

  @Expose()
  set courseId(value: number) {
    if (this._courseId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._courseId = value;
  }

  @Expose()
  set courseScheduleId(value: number) {
    if (this._courseScheduleId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._courseScheduleId = value;
  }

  get userId(): number {
    return this._userId;
  }

  get scheduleId(): number {
    return this._scheduleId;
  }

  get scheduleType(): ScheduleType {
    return this._scheduleType;
  }

  get courseId(): number {
    return this._courseId;
  }

  get courseScheduleId(): number {
    return this._courseScheduleId;
  }
}
