import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class ClassResponse {
  @ApiProperty()
  @Expose()
  public classId: number;

  @ApiProperty()
  @Expose()
  public courseId: number;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty()
  @Expose()
  public numberOfInstructors: number;

  @ApiProperty()
  @Expose()
  public numberOfAssignments: number;

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty()
  @Expose()
  public updatedAt: Date;
}
