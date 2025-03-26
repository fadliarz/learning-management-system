import { ApiProperty } from '@nestjs/swagger';
import CourseScheduleResponse from '../../../domain/application-service/features/common/CourseScheduleResponse';

export default class CourseSchedulesWrapperResponse {
  @ApiProperty({ type: [CourseScheduleResponse] })
  public data: CourseScheduleResponse[];

  constructor(data: CourseScheduleResponse[]) {
    this.data = data;
  }
}
