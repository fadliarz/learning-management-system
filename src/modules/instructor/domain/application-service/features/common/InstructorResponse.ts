import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class InstructorResponse {
  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  courseId: number;

  @ApiProperty()
  @Expose()
  classId: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  NIM: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
