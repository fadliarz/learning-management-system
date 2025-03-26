import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class UserScheduleResponse {
  @ApiProperty()
  @Expose()
  public scheduleId: number;

  @ApiProperty()
  @Expose()
  public userId: number;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty()
  @Expose()
  public description: string;

  @ApiProperty()
  @Expose()
  public location: string;

  @ApiProperty()
  @Expose()
  public startDate: Date;

  @ApiProperty()
  @Expose()
  public endDate: Date;
}
