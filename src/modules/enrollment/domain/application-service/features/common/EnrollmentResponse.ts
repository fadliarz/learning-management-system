import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class EnrollmentResponse {
  @ApiProperty()
  @Expose()
  public userId: number;

  @ApiProperty()
  @Expose()
  public courseId: number;

  @ApiProperty()
  @Expose()
  public classId: number;

  @ApiProperty()
  @Expose()
  public createdAt: Date;
}
