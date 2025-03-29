import { UserRole } from './UserRole';
import { Expose } from 'class-transformer';
import ISO8601ToDate from '../../../../../common/common-domain/decorator/ISO8601ToDate';
import TimeFactory from '../../../../../common/common-domain/helper/TimeFactory';
import { RefreshToken } from './RefreshToken';
import ImmutableFieldException from '../../../../../common/common-domain/exception/ImmutableFieldException';
import { Permission } from '../../../../privilege/domain/domain-core/entity/Permission';
import ToArray from '../../../../../common/common-domain/decorator/ToArray';

export default class User {
  private _userId: number;
  private _avatar: string;
  private _email: string;
  private _password: string;
  private _phoneNumber: string;
  private _refreshTokens: RefreshToken[];
  private _name: string;
  private _about: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _role: UserRole;
  private _dateOfBirth: Date;
  private _address: string;
  private _bloodType: string;
  private _medicalHistories: string[];
  private _enrolledStudentUnits: string[];
  private _hobbies: string[];
  private _lineId: string;
  private _emergencyNumber: string;
  private _numberOfManagedClasses: number;
  private _permissions: Permission[];

  public update(): void {
    this._updatedAt = TimeFactory.generate();
  }

  public create(): void {
    const now: Date = TimeFactory.generate();
    this._userId = TimeFactory.dateToRandomMicroseconds(now);
    this._createdAt = now;
    this._role = UserRole.STUDENT;
    this._numberOfManagedClasses = 0;
  }

  @Expose()
  set avatar(value: string) {
    this._avatar = value;
  }

  @Expose()
  set userId(value: number) {
    if (this._userId !== undefined) {
      throw new ImmutableFieldException();
    }

    this._userId = value;
  }

  @Expose()
  set email(value: string) {
    this._email = value;
  }

  @Expose()
  set password(value: string) {
    this._password = value;
  }

  @Expose()
  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  @Expose()
  set refreshTokens(value: RefreshToken[]) {
    this._refreshTokens = value;
  }

  @Expose()
  set name(value: string) {
    this._name = value;
  }

  @Expose()
  set about(value: string) {
    this._about = value;
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
  set role(value: UserRole) {
    this._role = value;
  }

  @Expose()
  @ISO8601ToDate()
  set dateOfBirth(value: Date) {
    this._dateOfBirth = value;
  }

  @Expose()
  set address(value: string) {
    this._address = value;
  }

  @Expose()
  set bloodType(value: string) {
    this._bloodType = value;
  }

  @Expose()
  set medicalHistories(value: string[]) {
    this._medicalHistories = value;
  }

  @Expose()
  set enrolledStudentUnits(value: string[]) {
    this._enrolledStudentUnits = value;
  }

  @Expose()
  set hobbies(value: string[]) {
    this._hobbies = value;
  }

  @Expose()
  set lineId(value: string) {
    this._lineId = value;
  }

  @Expose()
  set emergencyNumber(value: string) {
    this._emergencyNumber = value;
  }

  @Expose()
  set numberOfManagedClasses(value: number) {
    if (this._numberOfManagedClasses !== undefined) {
      throw new ImmutableFieldException();
    }

    this._numberOfManagedClasses = value;
  }

  @Expose()
  @ToArray()
  set permissions(value: Permission[]) {
    if (this._permissions !== undefined) {
      throw new ImmutableFieldException();
    }

    this._permissions = value;
  }

  get userId(): number {
    return this._userId;
  }

  get avatar(): string {
    return this._avatar;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  get refreshTokens(): RefreshToken[] {
    return this._refreshTokens;
  }

  get name(): string {
    return this._name;
  }

  get about(): string {
    return this._about;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get role(): UserRole {
    return this._role;
  }

  get dateOfBirth(): Date {
    return this._dateOfBirth;
  }

  get address(): string {
    return this._address;
  }

  get bloodType(): string {
    return this._bloodType;
  }

  get medicalHistories(): string[] {
    return this._medicalHistories;
  }

  get enrolledStudentUnits(): string[] {
    return this._enrolledStudentUnits;
  }

  get hobbies(): string[] {
    return this._hobbies;
  }

  get lineId(): string {
    return this._lineId;
  }

  get emergencyNumber(): string {
    return this._emergencyNumber;
  }

  get numberOfManagedClasses(): number {
    return this._numberOfManagedClasses;
  }

  get permissions(): Permission[] {
    return this._permissions;
  }
}
