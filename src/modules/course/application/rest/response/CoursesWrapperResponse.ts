import CourseResponse from '../../../domain/application-service/features/common/CourseResponse';
import { ApiProperty } from '@nestjs/swagger';

export default class CoursesWrapperResponse {
  @ApiProperty({ type: [CourseResponse] })
  public data: CourseResponse[];

  constructor(data: CourseResponse[]) {
    this.data = data;
  }
}
