import { ApiProperty } from '@nestjs/swagger';
import ScholarshipResponse from '../../../domain/application-service/features/common/ScholarshipResponse';

export default class ScholarshipsWrapperResponse {
  @ApiProperty({ type: [ScholarshipResponse] })
  public data: ScholarshipResponse[];

  constructor(data: ScholarshipResponse[]) {
    this.data = data;
  }
}
