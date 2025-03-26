import { ApiProperty } from '@nestjs/swagger';
import UserAssignmentResponse from '../../../domain/application-service/features/common/UserAssignmentResponse';

export default class UserAssignmentsWrapperResponse {
  @ApiProperty({ type: [UserAssignmentResponse] })
  public data: UserAssignmentResponse[];

  constructor(data: UserAssignmentResponse[]) {
    this.data = data;
  }
}
