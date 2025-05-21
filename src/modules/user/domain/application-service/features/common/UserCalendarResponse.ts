import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class UserCalendarResponse {
  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty()
  @Expose()
  public date: number;
}
