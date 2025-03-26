import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class DynamoDBConfig {
  private readonly _USER_TABLE;
  private readonly _ATTACHMENT_TABLE;
  private readonly _CATEGORY_TABLE;
  private readonly _CLASS_TABLE: string;
  private readonly _CLASS_ASSIGNMENT_TABLE: string;
  private readonly _COURSE_TABLE: string;
  private readonly _COURSE_SCHEDULE_TABLE: string;
  private readonly _ENROLLMENT_TABLE: string;
  private readonly _FORM_SUBMISSION_TABLE: string;
  private readonly _INSTRUCTOR_TABLE: string;
  private readonly _LESSON_TABLE: string;
  private readonly _PRIVILEGE_TABLE: string;
  private readonly _USER_ASSIGNMENT_TABLE: string;
  private readonly _SCHOLARSHIP_TABLE: string;
  private readonly _USER_SCHEDULE_TABLE: string;
  private readonly _VIDEO_TABLE: string;

  constructor(private readonly _configService: ConfigService) {
    this._USER_TABLE = this._configService.getOrThrow<string>('USER_TABLE');
    this._CLASS_TABLE = this._configService.getOrThrow<string>('CLASS_TABLE');
    this._ATTACHMENT_TABLE =
      this._configService.getOrThrow<string>('ATTACHMENT_TABLE');
    this._CATEGORY_TABLE =
      this._configService.getOrThrow<string>('CATEGORY_TABLE');
    this._CLASS_TABLE = this._configService.getOrThrow<string>('CLASS_TABLE');
    this._CLASS_ASSIGNMENT_TABLE = this._configService.getOrThrow<string>(
      'CLASS_ASSIGNMENT_TABLE',
    );
    this._COURSE_TABLE = this._configService.getOrThrow<string>('COURSE_TABLE');
    this._COURSE_SCHEDULE_TABLE = this._configService.getOrThrow<string>(
      'COURSE_SCHEDULE_TABLE',
    );
    this._ENROLLMENT_TABLE =
      this._configService.getOrThrow<string>('ENROLLMENT_TABLE');
    this._FORM_SUBMISSION_TABLE = this._configService.getOrThrow<string>(
      'FORM_SUBMISSION_TABLE',
    );
    this._INSTRUCTOR_TABLE =
      this._configService.getOrThrow<string>('INSTRUCTOR_TABLE');
    this._LESSON_TABLE = this._configService.getOrThrow<string>('LESSON_TABLE');
    this._PRIVILEGE_TABLE =
      this._configService.getOrThrow<string>('PRIVILEGE_TABLE');
    this._USER_ASSIGNMENT_TABLE = this._configService.getOrThrow<string>(
      'USER_ASSIGNMENT_TABLE',
    );
    this._SCHOLARSHIP_TABLE =
      this._configService.getOrThrow<string>('SCHOLARSHIP_TABLE');
    this._USER_SCHEDULE_TABLE = this._configService.getOrThrow<string>(
      'USER_SCHEDULE_TABLE',
    );
    this._VIDEO_TABLE = this._configService.getOrThrow<string>('VIDEO_TABLE');
  }

  get USER_TABLE() {
    return this._USER_TABLE;
  }

  get ATTACHMENT_TABLE() {
    return this._ATTACHMENT_TABLE;
  }

  get CATEGORY_TABLE() {
    return this._CATEGORY_TABLE;
  }

  get CLASS_TABLE(): string {
    return this._CLASS_TABLE;
  }

  get CLASS_ASSIGNMENT_TABLE(): string {
    return this._CLASS_ASSIGNMENT_TABLE;
  }

  get COURSE_TABLE(): string {
    return this._COURSE_TABLE;
  }

  get COURSE_SCHEDULE_TABLE(): string {
    return this._COURSE_SCHEDULE_TABLE;
  }

  get ENROLLMENT_TABLE(): string {
    return this._ENROLLMENT_TABLE;
  }

  get FORM_SUBMISSION_TABLE(): string {
    return this._FORM_SUBMISSION_TABLE;
  }

  get INSTRUCTOR_TABLE(): string {
    return this._INSTRUCTOR_TABLE;
  }

  get LESSON_TABLE(): string {
    return this._LESSON_TABLE;
  }

  get PRIVILEGE_TABLE(): string {
    return this._PRIVILEGE_TABLE;
  }

  get USER_ASSIGNMENT_TABLE(): string {
    return this._USER_ASSIGNMENT_TABLE;
  }

  get SCHOLARSHIP_TABLE(): string {
    return this._SCHOLARSHIP_TABLE;
  }

  get USER_SCHEDULE_TABLE(): string {
    return this._USER_SCHEDULE_TABLE;
  }

  get VIDEO_TABLE(): string {
    return this._VIDEO_TABLE;
  }

  get configService(): ConfigService {
    return this._configService;
  }
}
