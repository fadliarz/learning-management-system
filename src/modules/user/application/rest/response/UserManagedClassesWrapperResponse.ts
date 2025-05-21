import { ApiProperty } from '@nestjs/swagger';
import UserManagedClassResponse from '../../../domain/application-service/features/common/UserManagedClassResponse';

export default class UserManagedClassesWrapperResponse {
  @ApiProperty({ type: [UserManagedClassResponse] })
  public data: UserManagedClassResponse[];

  constructor(data: UserManagedClassResponse[]) {
    this.data = data;
  }
}
