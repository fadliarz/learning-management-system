import { ApiProperty } from '@nestjs/swagger';
import PublicUserResponse from '../../../domain/application-service/features/common/PublicUserResponse';

export default class PublicUsersWrapperResponse {
  @ApiProperty({ type: [PublicUserResponse] })
  public data: PublicUserResponse[];

  constructor(data: PublicUserResponse[]) {
    this.data = data;
  }
}
