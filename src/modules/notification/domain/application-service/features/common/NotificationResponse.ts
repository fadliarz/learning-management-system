import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class NotificationResponse {
  @ApiProperty()
  @Expose()
  public userId: number;

  @ApiProperty()
  @Expose()
  public notificationId: number;

  @ApiProperty()
  @Expose()
  public redirect?: string;

  @ApiProperty()
  @Expose()
  public isSeen: boolean;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty({ required: false })
  @Expose()
  public description?: string;
}
