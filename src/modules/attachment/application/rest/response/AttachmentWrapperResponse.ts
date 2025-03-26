import { ApiProperty } from '@nestjs/swagger';
import AttachmentResponse from '../../../domain/application-service/features/common/AttachmentResponse';

export default class AttachmentWrapperResponse {
  @ApiProperty({ type: AttachmentResponse })
  public data: AttachmentResponse;

  constructor(data: AttachmentResponse) {
    this.data = data;
  }
}
