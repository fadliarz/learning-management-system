import { ApiProperty } from '@nestjs/swagger';
import EnrollmentResponse from '../../../domain/application-service/features/common/EnrollmentResponse';

export default class EnrollmentWrapperResponse {
  @ApiProperty({ type: EnrollmentResponse })
  public data: EnrollmentResponse;

  constructor(data: EnrollmentResponse) {
    this.data = data;
  }
}
