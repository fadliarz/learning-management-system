import LessonResponse from '../../../domain/application-service/features/common/LessonResponse';
import { ApiProperty } from '@nestjs/swagger';

export default class LessonWrapperResponse {
  @ApiProperty({ type: LessonResponse })
  public data: LessonResponse;

  constructor(data: LessonResponse) {
    this.data = data;
  }
}
