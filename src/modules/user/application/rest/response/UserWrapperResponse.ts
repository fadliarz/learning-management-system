import UserResponse from '../../../domain/application-service/features/common/UserResponse';
import { ApiProperty } from '@nestjs/swagger';

export default class UserWrapperResponse {
  @ApiProperty({ type: UserResponse })
  public data: UserResponse;

  constructor(data: UserResponse) {
    this.data = data;
  }
}
