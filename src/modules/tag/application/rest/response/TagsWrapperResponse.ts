import { ApiProperty } from '@nestjs/swagger';
import TagResponse from '../../../domain/application-service/features/common/TagResponse';

export default class TagsWrapperResponse {
  @ApiProperty({ type: [TagResponse] })
  public data: TagResponse[];

  constructor(data: TagResponse[]) {
    this.data = data;
  }
}
