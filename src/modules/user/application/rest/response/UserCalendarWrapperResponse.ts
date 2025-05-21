import { ApiProperty } from '@nestjs/swagger';
import UserCalendarResponse from '../../../domain/application-service/features/common/UserCalendarResponse';

export default class UserCalendarWrapperResponse {
  @ApiProperty({ type: [UserCalendarResponse] })
  public data: UserCalendarResponse[];

  constructor(data: UserCalendarResponse[]) {
    this.data = data;
  }
}
