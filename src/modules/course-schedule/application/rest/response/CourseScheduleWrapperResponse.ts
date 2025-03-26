import CourseScheduleResponse from '../../../domain/application-service/features/common/CourseScheduleResponse';
import { ApiProperty } from '@nestjs/swagger';

export default class CourseScheduleWrapperResponse {
  @ApiProperty({ type: CourseScheduleResponse })
  public data: CourseScheduleResponse;

  constructor(data: CourseScheduleResponse) {
    this.data = data;
  }
}
