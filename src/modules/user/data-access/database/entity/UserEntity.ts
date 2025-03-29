import { UserRole } from '../../../domain/domain-core/entity/UserRole';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';
import { Expose } from 'class-transformer';
import { RefreshToken } from '../../../domain/domain-core/entity/RefreshToken';
import { Permission } from '../../../../privilege/domain/domain-core/entity/Permission';
import ToSet from '../../../../../common/common-domain/decorator/ToSet';

export default class UserEntity {
  @Expose()
  public userId: number;

  @Expose()
  public avatar: string;

  @Expose()
  public email: string;

  @Expose()
  public password: string;

  @Expose()
  public refreshTokens: RefreshToken[];

  @Expose()
  public phoneNumber: string;

  @Expose()
  public name: string;

  @Expose()
  public about: string;

  @Expose()
  @ToISO()
  public createdAt: string;

  @Expose()
  @ToISO()
  public updatedAt: string;

  @Expose()
  public role: UserRole;

  @Expose()
  @ToISO()
  public dateOfBirth: string;

  @Expose()
  public address: string;

  @Expose()
  public bloodType: string;

  @Expose()
  public medicalHistories: string[];

  @Expose()
  public enrolledStudentUnits: string[];

  @Expose()
  public hobbies: string[];

  @Expose()
  public lineId: string;

  @Expose()
  public emergencyNumber: string;

  @Expose()
  public numberOfManagedClasses: number;

  @Expose()
  @ToSet()
  public permissions: Set<Permission>;
}
