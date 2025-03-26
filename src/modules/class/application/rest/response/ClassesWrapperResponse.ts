import { ApiProperty } from '@nestjs/swagger';
import ClassResponse from '../../../domain/application-service/features/common/ClassResponse';

export default class ClassesWrapperResponse {
  @ApiProperty({ type: [ClassResponse] })
  public data: ClassResponse[];

  constructor(data: ClassResponse[]) {
    this.data = data;
  }
}
