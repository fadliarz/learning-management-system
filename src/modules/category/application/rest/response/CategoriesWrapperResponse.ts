import { ApiProperty } from '@nestjs/swagger';
import CategoryResponse from '../../../domain/application-service/features/common/CategoryResponse';

export default class CategoriesWrapperResponse {
  @ApiProperty({ type: [CategoryResponse] })
  public data: CategoryResponse[];

  constructor(data: CategoryResponse[]) {
    this.data = data;
  }
}
