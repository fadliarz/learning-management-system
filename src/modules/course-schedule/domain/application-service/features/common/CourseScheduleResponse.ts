import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class CourseScheduleResponse {
  @ApiProperty()
  @Expose()
  public scheduleId: number;

  @ApiProperty()
  @Expose()
  public courseId: number;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty({ required: false })
  @Expose()
  public description: string;

  @ApiProperty()
  @Expose()
  public location: string;

  @Expose()
  public startDate: Date;

  @Expose()
  public endDate: Date;

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  public updatedAt: Date;
}
