import { ApiProperty } from '@nestjs/swagger';
import FormSubmissionResponse from '../../../domain/application-service/features/common/FormSubmissionResponse';

export default class FormSubmissionsWrapperResponse {
  @ApiProperty({ type: [FormSubmissionResponse] })
  public data: FormSubmissionResponse[];

  constructor(data: FormSubmissionResponse[]) {
    this.data = data;
  }
}
