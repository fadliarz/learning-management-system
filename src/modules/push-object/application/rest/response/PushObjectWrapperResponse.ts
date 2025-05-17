import { ApiProperty } from '@nestjs/swagger';
import PushObjectResponse from '../../../domain/application-service/features/common/PushObjectResponse';

export default class PushObjectWrapperResponse {
  @ApiProperty({ type: PushObjectResponse })
  public data: PushObjectResponse;

  constructor(data: PushObjectResponse) {
    this.data = data;
  }
}
