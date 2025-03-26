import { ApiProperty } from '@nestjs/swagger';
import FormSubmissionResponse from '../../../domain/application-service/features/common/FormSubmissionResponse';

export default class FormSubmissionWrapperResponse {
  @ApiProperty({ type: FormSubmissionResponse })
  public data: FormSubmissionResponse;

  constructor(data: FormSubmissionResponse) {
    this.data = data;
  }
}
