import AttachmentResponse from '../../../domain/application-service/features/common/AttachmentResponse';
import { ApiProperty } from '@nestjs/swagger';

export default class AttachmentsWrapperResponse {
  @ApiProperty({ type: [AttachmentResponse] })
  public data: AttachmentResponse[];

  constructor(data: AttachmentResponse[]) {
    this.data = data;
  }
}
