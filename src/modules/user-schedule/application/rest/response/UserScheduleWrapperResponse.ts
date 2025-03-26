import { ApiProperty } from '@nestjs/swagger';
import UserScheduleResponse from '../../../domain/application-service/features/common/UserScheduleResponse';

export default class UserScheduleWrapperResponse {
  @ApiProperty({ type: UserScheduleResponse })
  public data: UserScheduleResponse;

  constructor(data: UserScheduleResponse) {
    this.data = data;
  }
}
