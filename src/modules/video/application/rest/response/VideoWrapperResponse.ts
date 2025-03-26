import { ApiProperty } from '@nestjs/swagger';
import VideoResponse from '../../../domain/application-service/features/common/VideoResponse';

export default class VideoWrapperResponse {
  @ApiProperty({ type: VideoResponse })
  public data: VideoResponse;

  constructor(data: VideoResponse) {
    this.data = data;
  }
}
