import { ApiProperty } from '@nestjs/swagger';
import PrivilegeResponse from '../../../domain/application-service/features/common/PrivilegeResponse';

export default class PrivilegeWrapperResponse {
  @ApiProperty({ type: PrivilegeResponse })
  public data: PrivilegeResponse;

  constructor(data: PrivilegeResponse) {
    this.data = data;
  }
}
