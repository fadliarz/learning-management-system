import { ApiProperty } from '@nestjs/swagger';
import InstructorResponse from '../../../domain/application-service/features/common/InstructorResponse';

export default class InstructorsWrapperResponse {
  @ApiProperty({ type: [InstructorResponse] })
  public data: InstructorResponse[];

  constructor(data: InstructorResponse[]) {
    this.data = data;
  }
}
