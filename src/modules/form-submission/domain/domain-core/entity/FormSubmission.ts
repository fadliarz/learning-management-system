import ResponseItem from './ResponseItem';
import { Expose } from 'class-transformer';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import Deserialize from '../../../../../common/common-domain/decorator/Deserialize';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';

export default class FormSubmission {
  private _formId: string;
  private _submissionId: number;
  private _userId: number;
  private _responseItems: ResponseItem[];
  private _createdAt: Date;

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._submissionId = TimeFactory.dateToRandomMicroseconds(now);
    this._createdAt = now;
  }

  @Expose()
  set userId(value: number) {
    if (this._userId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._userId = value;
  }

  @Expose()
  set submissionId(value: number) {
    if (this._submissionId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._submissionId = value;
  }

  @Expose()
  set formId(value: string) {
    if (this._formId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._formId = value;
  }

  @Expose()
  @Deserialize()
  set responseItems(value: ResponseItem[]) {
    this._responseItems = value;
  }

  @Expose()
  @ISO8601ToDate()
  set createdAt(value: Date) {
    if (this._createdAt !== undefined) {
      throw new ImmutableFieldException();
    }

    this._createdAt = value;
  }
}
