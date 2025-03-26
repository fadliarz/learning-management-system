import { ApiProperty } from '@nestjs/swagger';
import ClassAssignmentResponse from '../../../domain/application-service/features/common/ClassAssignmentResponse';

export default class ClassAssignmentWrapperResponse {
  @ApiProperty({ type: ClassAssignmentResponse })
  public data: ClassAssignmentResponse;

  constructor(data: ClassAssignmentResponse) {
    this.data = data;
  }
}
