import { UserRole } from '../../../domain-core/entity/UserRole';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Permission } from '../../../../../privilege/domain/domain-core/entity/Permission';

export default class UserResponse {
  @ApiProperty()
  @Expose()
  public userId: number;

  @ApiProperty()
  @Expose()
  public avatar: string;

  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public phoneNumber: string;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty({ required: false })
  @Expose()
  public about: string;

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  public updatedAt: Date;

  @ApiProperty({ enum: UserRole })
  @Expose()
  public role: UserRole;

  @ApiProperty()
  @Expose()
  public dateOfBirth: Date;

  @ApiProperty()
  @Expose()
  public address: string;

  @ApiProperty()
  @Expose()
  public bloodType: string;

  @ApiProperty()
  @Expose()
  public medicalHistories: string[];

  @ApiProperty()
  @Expose()
  public enrolledStudentUnits: string[];

  @ApiProperty()
  @Expose()
  public hobbies: string[];

  @ApiProperty()
  @Expose()
  public lineId: string;

  @ApiProperty()
  @Expose()
  public emergencyNumber: string;

  @ApiProperty()
  @Expose()
  public numberOfManagedClasses: number;

  @ApiProperty({ enum: [Permission] })
  @Expose()
  public permissions: Permission[];
}
